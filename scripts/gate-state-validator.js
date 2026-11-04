/**
 * Mandatory State-Based Execution Gate Validator
 * 
 * Enforces the 10-state Specialist Decision Gate as a deterministic state machine:
 * 1.  WAITING_FOR_SPECIALISTS
 * 2.  SKILL_MANAGER_COMPLETED
 * 3.  GRILL_ME_COMPLETED
 * 4.  WAITING_FOR_BOTH_REPORTS
 * 5.  READY_FOR_MANAGER_DECISION
 * 6.  WAITING_FOR_USER_CLARIFICATION
 * 7.  APPROVED_FOR_EXECUTION
 * 8.  EXECUTING
 * 9.  BLOCKED
 * 10. COMPLETED
 * 
 * Rules:
 * - Skill Manager and Grill-Me Specialist receive tasks simultaneously.
 * - Both must submit valid final reports to Manager.
 * - Manager verifies both reports before decision.
 * - If clarification is required, transitions to WAITING_FOR_USER_CLARIFICATION.
 * - Only Manager can transition to APPROVED_FOR_EXECUTION.
 * - Sub Agents verify execution authorization before starting.
 * - Sub Manager monitors state transitions, timeouts, and blocked tasks.
 * - Failed or missing reports transition to BLOCKED.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

export const GATE_STATES = Object.freeze({
  WAITING_FOR_SPECIALISTS: 'WAITING_FOR_SPECIALISTS',
  SKILL_MANAGER_COMPLETED: 'SKILL_MANAGER_COMPLETED',
  GRILL_ME_COMPLETED: 'GRILL_ME_COMPLETED',
  WAITING_FOR_BOTH_REPORTS: 'WAITING_FOR_BOTH_REPORTS',
  READY_FOR_MANAGER_DECISION: 'READY_FOR_MANAGER_DECISION',
  WAITING_FOR_USER_CLARIFICATION: 'WAITING_FOR_USER_CLARIFICATION',
  APPROVED_FOR_EXECUTION: 'APPROVED_FOR_EXECUTION',
  EXECUTING: 'EXECUTING',
  BLOCKED: 'BLOCKED',
  COMPLETED: 'COMPLETED'
});

export const ROLES = Object.freeze({
  CEO: 'CEO',
  MANAGER: 'MANAGER',
  SKILL_MANAGER: 'SKILL_MANAGER',
  GRILL_ME_SPECIALIST: 'GRILL_ME_SPECIALIST',
  SUB_MANAGER: 'SUB_MANAGER',
  SUB_AGENT: 'SUB_AGENT',
  QA_AGENT: 'QA_AGENT'
});

export const DEFAULT_STATE_FILE_PATH = path.resolve(projectRoot, '.agents', 'state', 'decision_gate_state.json');

export class DecisionGateStateMachine {
  constructor(stateFilePath = DEFAULT_STATE_FILE_PATH) {
    this.stateFilePath = stateFilePath;
    this.state = this._createInitialState();
  }

  _createInitialState() {
    const now = new Date().toISOString();
    return {
      $schema: 'https://antigravity.dev/schemas/decision-gate-state-v1.json',
      version: '1.0.0',
      taskId: null,
      taskDescription: '',
      currentState: null,
      history: [],
      specialists: {
        skillManager: {
          status: 'IDLE', // IDLE, PENDING, COMPLETED, FAILED, TIMEOUT
          dispatchedAt: null,
          completedAt: null,
          report: null,
          error: null
        },
        grillMeSpecialist: {
          status: 'IDLE', // IDLE, PENDING, COMPLETED, FAILED, TIMEOUT
          dispatchedAt: null,
          completedAt: null,
          clarificationRequired: false,
          clarificationQuestions: [],
          clarificationAnswers: [],
          report: null,
          error: null
        }
      },
      authorization: {
        token: null,
        issuedBy: null,
        issuedAt: null,
        authorizedSubAgents: []
      },
      subManager: {
        lastMonitoredAt: now,
        status: 'HEALTHY',
        activeProcesses: [],
        alerts: []
      },
      metadata: {
        createdAt: now,
        updatedAt: now
      }
    };
  }

  loadState() {
    if (fs.existsSync(this.stateFilePath)) {
      try {
        const raw = fs.readFileSync(this.stateFilePath, 'utf8');
        this.state = JSON.parse(raw);
        return this.state;
      } catch (err) {
        console.error(`Failed to load decision gate state file: ${err.message}`);
      }
    }
    return this.state;
  }

  saveState() {
    try {
      const dir = path.dirname(this.stateFilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      this.state.metadata.updatedAt = new Date().toISOString();
      fs.writeFileSync(this.stateFilePath, JSON.stringify(this.state, null, 2), 'utf8');
      return true;
    } catch (err) {
      console.error(`Failed to save decision gate state file: ${err.message}`);
      return false;
    }
  }

  _recordTransition(from, to, actor, reason, payload = {}) {
    this.state.currentState = to;
    const record = {
      from,
      to,
      timestamp: new Date().toISOString(),
      actor,
      reason,
      ...payload
    };
    this.state.history.push(record);
  }

  /**
   * Manager initiates task and simultaneously dispatches to both specialists
   */
  initiateTask({ taskId, description, actor = ROLES.MANAGER }) {
    if (actor !== ROLES.MANAGER) {
      throw new Error(`Unauthorized: Only ${ROLES.MANAGER} can initiate task execution gate.`);
    }

    const now = new Date().toISOString();
    this.state.taskId = taskId || `TASK-${Date.now()}`;
    this.state.taskDescription = description || 'Antigravity Execution Task';
    this.state.specialists.skillManager = {
      status: 'PENDING',
      dispatchedAt: now,
      completedAt: null,
      report: null,
      error: null
    };
    this.state.specialists.grillMeSpecialist = {
      status: 'PENDING',
      dispatchedAt: now,
      completedAt: null,
      clarificationRequired: false,
      clarificationQuestions: [],
      clarificationAnswers: [],
      report: null,
      error: null
    };
    this.state.authorization = {
      token: null,
      issuedBy: null,
      issuedAt: null,
      authorizedSubAgents: []
    };

    const previousState = this.state.currentState;
    this._recordTransition(
      previousState,
      GATE_STATES.WAITING_FOR_SPECIALISTS,
      actor,
      'Simultaneous dispatch to Skill Manager and Grill-Me Specialist'
    );
    this.saveState();
    return this.state.currentState;
  }

  /**
   * Skill Manager submits capability and tool allocation report
   */
  submitSkillManagerReport({ report, status = 'COMPLETED', error = null, actor = ROLES.SKILL_MANAGER }) {
    if (this.state.currentState === GATE_STATES.BLOCKED) {
      throw new Error('Gate is currently in BLOCKED state. Cannot submit report without Manager unblocking.');
    }

    const now = new Date().toISOString();
    const sm = this.state.specialists.skillManager;
    sm.completedAt = now;
    sm.status = status;
    sm.error = error;

    // Report validation check: failed or incomplete report transitions to BLOCKED
    if (status !== 'COMPLETED' || !report || typeof report !== 'object') {
      sm.status = 'FAILED';
      sm.report = null;
      this._recordTransition(
        this.state.currentState,
        GATE_STATES.BLOCKED,
        actor,
        `Skill Manager report failed or invalid: ${error || 'Missing valid report payload'}`
      );
      this.saveState();
      return this.state.currentState;
    }

    sm.report = report;
    const gm = this.state.specialists.grillMeSpecialist;

    if (gm.status === 'PENDING') {
      // Skill Manager finished first; record completion and set WAITING_FOR_BOTH_REPORTS
      this._recordTransition(
        this.state.currentState,
        GATE_STATES.SKILL_MANAGER_COMPLETED,
        actor,
        'Skill Manager report submitted successfully while Grill-Me is pending'
      );
      this._recordTransition(
        GATE_STATES.SKILL_MANAGER_COMPLETED,
        GATE_STATES.WAITING_FOR_BOTH_REPORTS,
        ROLES.MANAGER,
        'Waiting for Grill-Me Specialist report to arrive'
      );
    } else if (gm.status === 'COMPLETED') {
      // Both specialists completed!
      if (gm.clarificationRequired && (!gm.clarificationAnswers || gm.clarificationAnswers.length === 0)) {
        this._recordTransition(
          this.state.currentState,
          GATE_STATES.WAITING_FOR_USER_CLARIFICATION,
          ROLES.MANAGER,
          'Both specialists reported, but Grill-Me user clarification is required'
        );
      } else {
        this._recordTransition(
          this.state.currentState,
          GATE_STATES.READY_FOR_MANAGER_DECISION,
          ROLES.MANAGER,
          'Both specialist reports received and validated; ready for Manager decision'
        );
      }
    }

    this.saveState();
    return this.state.currentState;
  }

  /**
   * Grill-Me Specialist submits clarification & governance report
   */
  submitGrillMeReport({ report, clarificationRequired = false, questions = [], status = 'COMPLETED', error = null, actor = ROLES.GRILL_ME_SPECIALIST }) {
    if (this.state.currentState === GATE_STATES.BLOCKED) {
      throw new Error('Gate is currently in BLOCKED state. Cannot submit report without Manager unblocking.');
    }

    const now = new Date().toISOString();
    const gm = this.state.specialists.grillMeSpecialist;
    gm.completedAt = now;
    gm.status = status;
    gm.error = error;
    gm.clarificationRequired = Boolean(clarificationRequired);
    gm.clarificationQuestions = Array.isArray(questions) ? questions : [];

    // Report validation check: failed or incomplete report transitions to BLOCKED
    if (status !== 'COMPLETED' || !report || typeof report !== 'object') {
      gm.status = 'FAILED';
      gm.report = null;
      this._recordTransition(
        this.state.currentState,
        GATE_STATES.BLOCKED,
        actor,
        `Grill-Me Specialist report failed or invalid: ${error || 'Missing valid report payload'}`
      );
      this.saveState();
      return this.state.currentState;
    }

    gm.report = report;
    const sm = this.state.specialists.skillManager;

    if (sm.status === 'PENDING') {
      // Grill-Me finished first; record completion and set WAITING_FOR_BOTH_REPORTS
      this._recordTransition(
        this.state.currentState,
        GATE_STATES.GRILL_ME_COMPLETED,
        actor,
        'Grill-Me Specialist report submitted successfully while Skill Manager is pending'
      );
      this._recordTransition(
        GATE_STATES.GRILL_ME_COMPLETED,
        GATE_STATES.WAITING_FOR_BOTH_REPORTS,
        ROLES.MANAGER,
        'Waiting for Skill Manager report to arrive'
      );
    } else if (sm.status === 'COMPLETED') {
      // Both specialists completed!
      if (gm.clarificationRequired && (!gm.clarificationAnswers || gm.clarificationAnswers.length === 0)) {
        this._recordTransition(
          this.state.currentState,
          GATE_STATES.WAITING_FOR_USER_CLARIFICATION,
          ROLES.MANAGER,
          'Grill-Me Specialist flagged essential ambiguities; awaiting user clarification via ask_question'
        );
      } else {
        this._recordTransition(
          this.state.currentState,
          GATE_STATES.READY_FOR_MANAGER_DECISION,
          ROLES.MANAGER,
          'Both specialist reports received and validated; ready for Manager decision'
        );
      }
    }

    this.saveState();
    return this.state.currentState;
  }

  /**
   * User clarification resolution handler
   */
  resolveUserClarification({ userAnswers, actor = ROLES.MANAGER }) {
    if (this.state.currentState !== GATE_STATES.WAITING_FOR_USER_CLARIFICATION) {
      throw new Error(`Cannot resolve user clarification from current state: ${this.state.currentState}`);
    }
    if (!userAnswers || (Array.isArray(userAnswers) && userAnswers.length === 0)) {
      throw new Error('User clarification answers cannot be empty.');
    }

    const gm = this.state.specialists.grillMeSpecialist;
    gm.clarificationAnswers = Array.isArray(userAnswers) ? userAnswers : [userAnswers];

    const sm = this.state.specialists.skillManager;
    if (sm.status === 'COMPLETED') {
      this._recordTransition(
        GATE_STATES.WAITING_FOR_USER_CLARIFICATION,
        GATE_STATES.READY_FOR_MANAGER_DECISION,
        actor,
        'User clarification received, evaluated, and resolved by Manager'
      );
    } else {
      this._recordTransition(
        GATE_STATES.WAITING_FOR_USER_CLARIFICATION,
        GATE_STATES.WAITING_FOR_BOTH_REPORTS,
        actor,
        'User clarification resolved; still awaiting Skill Manager report'
      );
    }

    this.saveState();
    return this.state.currentState;
  }

  /**
   * Mandatory Condition: Only Manager can transition the workflow to APPROVED_FOR_EXECUTION
   */
  approveExecution({ authorizedSubAgents = ['*'], skillsAllocated = [], actor = ROLES.MANAGER } = {}) {
    if (actor !== ROLES.MANAGER) {
      this._recordTransition(
        this.state.currentState,
        GATE_STATES.BLOCKED,
        actor,
        `SECURITY VIOLATION: Non-Manager role '${actor}' attempted to authorize execution.`
      );
      this.saveState();
      throw new Error(`Unauthorized: Only ${ROLES.MANAGER} can authorize execution. State transitions to BLOCKED.`);
    }

    if (this.state.currentState !== GATE_STATES.READY_FOR_MANAGER_DECISION) {
      this._recordTransition(
        this.state.currentState,
        GATE_STATES.BLOCKED,
        actor,
        `GATE VIOLATION: Cannot approve execution when gate is in state '${this.state.currentState}' (Requires ${GATE_STATES.READY_FOR_MANAGER_DECISION}).`
      );
      this.saveState();
      throw new Error(`Cannot approve execution from state '${this.state.currentState}'. Gate transitions to BLOCKED.`);
    }

    const sm = this.state.specialists.skillManager;
    const gm = this.state.specialists.grillMeSpecialist;
    if (sm.status !== 'COMPLETED' || gm.status !== 'COMPLETED' || !sm.report || !gm.report) {
      this._recordTransition(
        this.state.currentState,
        GATE_STATES.BLOCKED,
        actor,
        'GATE VIOLATION: Incomplete or missing specialist reports detected during approval.'
      );
      this.saveState();
      throw new Error('Specialist reports missing or incomplete. Gate transitions to BLOCKED.');
    }

    const now = new Date().toISOString();
    const token = `AUTH-MGR-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
    this.state.authorization = {
      token,
      issuedBy: ROLES.MANAGER,
      issuedAt: now,
      authorizedSubAgents: Array.isArray(authorizedSubAgents) ? authorizedSubAgents : [authorizedSubAgents],
      skillsAllocated
    };

    this._recordTransition(
      GATE_STATES.READY_FOR_MANAGER_DECISION,
      GATE_STATES.APPROVED_FOR_EXECUTION,
      actor,
      'Manager certified reports and granted formal execution authorization',
      { token }
    );

    this.saveState();
    return {
      state: this.state.currentState,
      token,
      authorizedSubAgents: this.state.authorization.authorizedSubAgents
    };
  }

  /**
   * Execution Authorization Check for Level 4 Sub Agents
   */
  verifyExecutionAuthorization({ subAgentRole, authorizationToken }) {
    if (this.state.currentState !== GATE_STATES.APPROVED_FOR_EXECUTION && this.state.currentState !== GATE_STATES.EXECUTING) {
      return {
        authorized: false,
        reason: `Sub Agent execution rejected: Current state is '${this.state.currentState}', not '${GATE_STATES.APPROVED_FOR_EXECUTION}' or '${GATE_STATES.EXECUTING}'.`
      };
    }

    const auth = this.state.authorization;
    if (!auth || !auth.token) {
      return {
        authorized: false,
        reason: 'Sub Agent execution rejected: Missing active authorization token.'
      };
    }

    if (authorizationToken && authorizationToken !== auth.token) {
      return {
        authorized: false,
        reason: 'Sub Agent execution rejected: Authorization token mismatch.'
      };
    }

    if (subAgentRole && !auth.authorizedSubAgents.includes('*') && !auth.authorizedSubAgents.includes(subAgentRole)) {
      return {
        authorized: false,
        reason: `Sub Agent execution rejected: Role '${subAgentRole}' is not in authorized roster.`
      };
    }

    return {
      authorized: true,
      token: auth.token,
      state: this.state.currentState
    };
  }

  /**
   * Sub Agent initiates execution
   */
  startExecution({ subAgentRole = 'GeneralSubAgent', authorizationToken, actor = ROLES.SUB_AGENT } = {}) {
    const authCheck = this.verifyExecutionAuthorization({ subAgentRole, authorizationToken });
    if (!authCheck.authorized) {
      throw new Error(`Sub Agent execution refused: ${authCheck.reason}`);
    }

    if (this.state.currentState === GATE_STATES.APPROVED_FOR_EXECUTION) {
      this._recordTransition(
        GATE_STATES.APPROVED_FOR_EXECUTION,
        GATE_STATES.EXECUTING,
        actor,
        `Sub Agent '${subAgentRole}' verified authorization token and commenced execution`
      );
      this.saveState();
    }

    return this.state.currentState;
  }

  /**
   * Execution completion and QA Grade A+ certification
   */
  completeExecution({ qaCertification, actor = ROLES.QA_AGENT } = {}) {
    if (this.state.currentState !== GATE_STATES.EXECUTING) {
      throw new Error(`Cannot complete execution from state '${this.state.currentState}'. Must be EXECUTING.`);
    }

    if (!qaCertification || qaCertification.grade !== 'A+') {
      this._recordTransition(
        this.state.currentState,
        GATE_STATES.BLOCKED,
        actor,
        `QA Verification failed: Grade '${qaCertification?.grade || 'NONE'}' does not meet Grade A+ certification standard.`
      );
      this.saveState();
      throw new Error('QA Verification failed: Execution gate transitioned to BLOCKED.');
    }

    this._recordTransition(
      GATE_STATES.EXECUTING,
      GATE_STATES.COMPLETED,
      actor,
      'Independent QA verified Grade A+ signoff; execution successfully completed',
      { qaCertification }
    );

    this.saveState();
    return this.state.currentState;
  }

  /**
   * Transition to BLOCKED
   */
  blockExecution({ reason, actor = ROLES.SUB_MANAGER } = {}) {
    const previousState = this.state.currentState;
    this._recordTransition(
      previousState,
      GATE_STATES.BLOCKED,
      actor,
      reason || 'Workflow blocked due to gate violation or timeout'
    );
    this.saveState();
    return this.state.currentState;
  }

  /**
   * Sub Manager heartbeat & passive monitoring check
   */
  recordSubManagerHeartbeat({ status = 'HEALTHY', activeProcesses = [], alerts = [], timeoutSeconds = 600 } = {}) {
    const now = new Date();
    this.state.subManager.lastMonitoredAt = now.toISOString();
    this.state.subManager.status = status;
    this.state.subManager.activeProcesses = activeProcesses;

    if (alerts && alerts.length > 0) {
      this.state.subManager.alerts.push(...alerts);
    }

    // Check for stalled tasks or timeout in WAITING states
    if (
      this.state.currentState === GATE_STATES.WAITING_FOR_SPECIALISTS ||
      this.state.currentState === GATE_STATES.WAITING_FOR_BOTH_REPORTS
    ) {
      const lastTransition = this.state.history[this.state.history.length - 1];
      if (lastTransition) {
        const transitionTime = new Date(lastTransition.timestamp);
        const elapsedSeconds = (now.getTime() - transitionTime.getTime()) / 1000;
        if (elapsedSeconds > timeoutSeconds) {
          this.blockExecution({
            reason: `Sub Manager detected specialist timeout: elapsed ${elapsedSeconds}s > allowed ${timeoutSeconds}s`,
            actor: ROLES.SUB_MANAGER
          });
        }
      }
    }

    this.saveState();
    return this.state.subManager;
  }

  /**
   * Reset gate to fresh state (Manager only)
   */
  reset({ actor = ROLES.MANAGER, reason = 'Manager manual reset' } = {}) {
    if (actor !== ROLES.MANAGER) {
      throw new Error(`Unauthorized: Only ${ROLES.MANAGER} can reset the decision gate.`);
    }
    const previousState = this.state.currentState;
    this.state = this._createInitialState();
    this._recordTransition(previousState, null, actor, reason);
    this.saveState();
    return true;
  }
}

export default DecisionGateStateMachine;
