/**
 * Comprehensive Test Suite for Specialist Decision Gate State Machine
 * 
 * Verifies all 10 states and mandatory transitions:
 * 1. Success transition sequence
 * 2. Skill Manager finishes first -> WAITING_FOR_BOTH_REPORTS
 * 3. Grill-Me finishes first -> WAITING_FOR_BOTH_REPORTS
 * 4. Grill-Me requires user clarification -> WAITING_FOR_USER_CLARIFICATION
 * 5. Sub Agent refuses execution if state != APPROVED_FOR_EXECUTION
 * 6. Specialist failure / timeout -> BLOCKED
 * 7. Only Manager transitions to APPROVED_FOR_EXECUTION
 * 8. Sub Manager monitoring and heartbeat validation
 */

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { DecisionGateStateMachine, GATE_STATES, ROLES } from './gate-state-validator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tempTestStateFile = path.resolve(__dirname, '..', '.agents', 'state', 'test_gate_state.json');

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (!condition) {
    console.error(`  ❌ FAIL: ${message}`);
    testsFailed++;
    throw new Error(message);
  } else {
    console.log(`  ✅ PASS: ${message}`);
    testsPassed++;
  }
}

function cleanUp() {
  if (fs.existsSync(tempTestStateFile)) {
    try {
      fs.unlinkSync(tempTestStateFile);
    } catch (_) {}
  }
}

console.log('='.repeat(85));
console.log('🚦 SPECIALIST DECISION GATE ENFORCEABLE STATE MACHINE TEST SUITE');
console.log('='.repeat(85));

try {
  cleanUp();

  // -----------------------------------------------------------------------------------------------
  // SCENARIO 1: Success transition sequence (both finish simultaneously / cleanly)
  // -----------------------------------------------------------------------------------------------
  console.log('\n[Scenario 1] Standard Success Transition Sequence:');
  {
    const sm = new DecisionGateStateMachine(tempTestStateFile);
    
    // 1. Initiate task
    sm.initiateTask({ taskId: 'TASK-001', description: 'Feature Implementation', actor: ROLES.MANAGER });
    assert(sm.state.currentState === GATE_STATES.WAITING_FOR_SPECIALISTS, 'Task starts in WAITING_FOR_SPECIALISTS');
    assert(sm.state.specialists.skillManager.status === 'PENDING', 'Skill Manager is PENDING');
    assert(sm.state.specialists.grillMeSpecialist.status === 'PENDING', 'Grill-Me Specialist is PENDING');

    // 2. Both specialists submit reports
    sm.submitSkillManagerReport({
      report: { verified: true, skills: ['react-patterns', 'testing-library'] },
      actor: ROLES.SKILL_MANAGER
    });
    assert(sm.state.currentState === GATE_STATES.WAITING_FOR_BOTH_REPORTS, 'State moves to WAITING_FOR_BOTH_REPORTS after SM completes');

    sm.submitGrillMeReport({
      report: { ambiguitiesResolved: true, remotePushVerified: false },
      clarificationRequired: false,
      actor: ROLES.GRILL_ME_SPECIALIST
    });
    assert(sm.state.currentState === GATE_STATES.READY_FOR_MANAGER_DECISION, 'State moves to READY_FOR_MANAGER_DECISION after both complete');

    // 3. Manager approves execution
    const approval = sm.approveExecution({
      authorizedSubAgents: ['FrontendEngineer', 'QATester'],
      skillsAllocated: ['react-patterns'],
      actor: ROLES.MANAGER
    });
    assert(sm.state.currentState === GATE_STATES.APPROVED_FOR_EXECUTION, 'State moves to APPROVED_FOR_EXECUTION by Manager');
    assert(typeof approval.token === 'string' && approval.token.startsWith('AUTH-MGR-'), 'Manager issues valid authorization token');

    // 4. Sub Agent verifies authorization & starts execution
    const authCheck = sm.verifyExecutionAuthorization({
      subAgentRole: 'FrontendEngineer',
      authorizationToken: approval.token
    });
    assert(authCheck.authorized === true, 'Sub Agent execution authorization is granted');

    sm.startExecution({
      subAgentRole: 'FrontendEngineer',
      authorizationToken: approval.token,
      actor: ROLES.SUB_AGENT
    });
    assert(sm.state.currentState === GATE_STATES.EXECUTING, 'State transitions to EXECUTING');

    // 5. Execution completes with QA Grade A+ certification
    sm.completeExecution({
      qaCertification: { grade: 'A+', testSuitePassed: true, securityClean: true },
      actor: ROLES.QA_AGENT
    });
    assert(sm.state.currentState === GATE_STATES.COMPLETED, 'State transitions to COMPLETED upon Grade A+ QA signoff');
  }

  // -----------------------------------------------------------------------------------------------
  // SCENARIO 2: Skill Manager finishes first -> WAITING_FOR_BOTH_REPORTS
  // -----------------------------------------------------------------------------------------------
  console.log('\n[Scenario 2] Skill Manager Finishes First Sequence:');
  {
    cleanUp();
    const sm = new DecisionGateStateMachine(tempTestStateFile);
    sm.initiateTask({ taskId: 'TASK-002', actor: ROLES.MANAGER });

    sm.submitSkillManagerReport({
      report: { verified: true, skills: ['node-patterns'] },
      actor: ROLES.SKILL_MANAGER
    });
    assert(sm.state.currentState === GATE_STATES.WAITING_FOR_BOTH_REPORTS, 'Skill Manager finishes first -> WAITING_FOR_BOTH_REPORTS');
    assert(sm.state.specialists.skillManager.status === 'COMPLETED', 'Skill Manager is COMPLETED');
    assert(sm.state.specialists.grillMeSpecialist.status === 'PENDING', 'Grill-Me is still PENDING');

    // Sub Agent execution attempt must fail here
    const authCheck = sm.verifyExecutionAuthorization({ subAgentRole: 'AnyAgent' });
    assert(authCheck.authorized === false, 'Sub Agent execution is locked out while waiting for both reports');

    // Later Grill-Me finishes
    sm.submitGrillMeReport({
      report: { ambiguitiesResolved: true },
      actor: ROLES.GRILL_ME_SPECIALIST
    });
    assert(sm.state.currentState === GATE_STATES.READY_FOR_MANAGER_DECISION, 'Transitions to READY_FOR_MANAGER_DECISION when Grill-Me finishes');
  }

  // -----------------------------------------------------------------------------------------------
  // SCENARIO 3: Grill-Me finishes first -> WAITING_FOR_BOTH_REPORTS
  // -----------------------------------------------------------------------------------------------
  console.log('\n[Scenario 3] Grill-Me Finishes First Sequence:');
  {
    cleanUp();
    const sm = new DecisionGateStateMachine(tempTestStateFile);
    sm.initiateTask({ taskId: 'TASK-003', actor: ROLES.MANAGER });

    sm.submitGrillMeReport({
      report: { ambiguitiesResolved: true },
      actor: ROLES.GRILL_ME_SPECIALIST
    });
    assert(sm.state.currentState === GATE_STATES.WAITING_FOR_BOTH_REPORTS, 'Grill-Me finishes first -> WAITING_FOR_BOTH_REPORTS');
    assert(sm.state.specialists.grillMeSpecialist.status === 'COMPLETED', 'Grill-Me is COMPLETED');
    assert(sm.state.specialists.skillManager.status === 'PENDING', 'Skill Manager is still PENDING');

    // Sub Agent execution attempt must fail here
    const authCheck = sm.verifyExecutionAuthorization({ subAgentRole: 'AnyAgent' });
    assert(authCheck.authorized === false, 'Sub Agent execution is locked out while waiting for both reports');

    // Later Skill Manager finishes
    sm.submitSkillManagerReport({
      report: { verified: true, skills: [] },
      actor: ROLES.SKILL_MANAGER
    });
    assert(sm.state.currentState === GATE_STATES.READY_FOR_MANAGER_DECISION, 'Transitions to READY_FOR_MANAGER_DECISION when Skill Manager finishes');
  }

  // -----------------------------------------------------------------------------------------------
  // SCENARIO 4: Grill-Me requires user clarification -> WAITING_FOR_USER_CLARIFICATION
  // -----------------------------------------------------------------------------------------------
  console.log('\n[Scenario 4] User Clarification Required Sequence:');
  {
    cleanUp();
    const sm = new DecisionGateStateMachine(tempTestStateFile);
    sm.initiateTask({ taskId: 'TASK-004', actor: ROLES.MANAGER });

    sm.submitSkillManagerReport({
      report: { verified: true },
      actor: ROLES.SKILL_MANAGER
    });

    sm.submitGrillMeReport({
      report: { ambiguitiesResolved: false },
      clarificationRequired: true,
      questions: ['Should we use Tailwind or vanilla CSS?'],
      actor: ROLES.GRILL_ME_SPECIALIST
    });
    assert(sm.state.currentState === GATE_STATES.WAITING_FOR_USER_CLARIFICATION, 'Transitions to WAITING_FOR_USER_CLARIFICATION');

    // Sub Agent execution attempt must fail while awaiting clarification
    const authCheck = sm.verifyExecutionAuthorization({ subAgentRole: 'FrontendEngineer' });
    assert(authCheck.authorized === false, 'Sub Agent execution is blocked during WAITING_FOR_USER_CLARIFICATION');

    // User clarifies
    sm.resolveUserClarification({
      userAnswers: ['Use Tailwind CSS as per DESIGN.md'],
      actor: ROLES.MANAGER
    });
    assert(sm.state.currentState === GATE_STATES.READY_FOR_MANAGER_DECISION, 'Transitions to READY_FOR_MANAGER_DECISION after clarification resolved');
  }

  // -----------------------------------------------------------------------------------------------
  // SCENARIO 5: Sub Agent refuses execution if state != APPROVED_FOR_EXECUTION
  // -----------------------------------------------------------------------------------------------
  console.log('\n[Scenario 5] Sub Agent Refuses Execution When Unauthorized:');
  {
    cleanUp();
    const sm = new DecisionGateStateMachine(tempTestStateFile);
    sm.initiateTask({ taskId: 'TASK-005', actor: ROLES.MANAGER });

    // Try executing when in WAITING_FOR_SPECIALISTS
    assert(sm.verifyExecutionAuthorization({ subAgentRole: 'SubAgent' }).authorized === false, 'Authorization check fails in WAITING_FOR_SPECIALISTS');
    
    let caughtError = false;
    try {
      sm.startExecution({ subAgentRole: 'SubAgent' });
    } catch (e) {
      caughtError = true;
    }
    assert(caughtError === true, 'Sub Agent execution threw error when state was not APPROVED_FOR_EXECUTION');
  }

  // -----------------------------------------------------------------------------------------------
  // SCENARIO 6: Specialist failure / timeout -> BLOCKED
  // -----------------------------------------------------------------------------------------------
  console.log('\n[Scenario 6] Specialist Failure & Timeout -> BLOCKED:');
  {
    cleanUp();
    const sm = new DecisionGateStateMachine(tempTestStateFile);
    sm.initiateTask({ taskId: 'TASK-006', actor: ROLES.MANAGER });

    // Specialist reports with FAILED status
    sm.submitSkillManagerReport({
      status: 'FAILED',
      error: 'Registry unreachable and skill search timed out',
      actor: ROLES.SKILL_MANAGER
    });
    assert(sm.state.currentState === GATE_STATES.BLOCKED, 'Failed specialist report transitions gate to BLOCKED');

    // In BLOCKED state, execution is completely locked
    const authCheck = sm.verifyExecutionAuthorization({ subAgentRole: 'SubAgent' });
    assert(authCheck.authorized === false, 'Sub Agent execution is strictly locked out in BLOCKED state');

    // Sub Manager timeout test
    cleanUp();
    const sm2 = new DecisionGateStateMachine(tempTestStateFile);
    sm2.initiateTask({ taskId: 'TASK-006B', actor: ROLES.MANAGER });
    // Artificially age the transition timestamp
    sm2.state.history[0].timestamp = new Date(Date.now() - 700000).toISOString();
    sm2.recordSubManagerHeartbeat({ timeoutSeconds: 600 });
    assert(sm2.state.currentState === GATE_STATES.BLOCKED, 'Sub Manager detects timeout and transitions to BLOCKED');
  }

  // -----------------------------------------------------------------------------------------------
  // SCENARIO 7: Only Manager can transition to APPROVED_FOR_EXECUTION
  // -----------------------------------------------------------------------------------------------
  console.log('\n[Scenario 7] Strict Manager-Only Authorization Enforcement:');
  {
    cleanUp();
    const sm = new DecisionGateStateMachine(tempTestStateFile);
    sm.initiateTask({ taskId: 'TASK-007', actor: ROLES.MANAGER });

    sm.submitSkillManagerReport({ report: { verified: true }, actor: ROLES.SKILL_MANAGER });
    sm.submitGrillMeReport({ report: { ambiguitiesResolved: true }, actor: ROLES.GRILL_ME_SPECIALIST });
    assert(sm.state.currentState === GATE_STATES.READY_FOR_MANAGER_DECISION, 'State is ready for decision');

    // Non-manager role (e.g. SUB_AGENT) attempts to approve execution
    let unauthorizedBlocked = false;
    try {
      sm.approveExecution({ actor: ROLES.SUB_AGENT });
    } catch (e) {
      unauthorizedBlocked = true;
    }
    assert(unauthorizedBlocked === true, 'Unauthorized actor was rejected from approving execution');
    assert(sm.state.currentState === GATE_STATES.BLOCKED, 'Gate transitioned to BLOCKED on authorization violation attempt');
  }

  // -----------------------------------------------------------------------------------------------
  // SCENARIO 8: Sub Manager Monitoring & Heartbeat Tracking
  // -----------------------------------------------------------------------------------------------
  console.log('\n[Scenario 8] Sub Manager Monitoring & Telemetry:');
  {
    cleanUp();
    const sm = new DecisionGateStateMachine(tempTestStateFile);
    sm.initiateTask({ taskId: 'TASK-008', actor: ROLES.MANAGER });

    const heartbeat = sm.recordSubManagerHeartbeat({
      status: 'HEALTHY',
      activeProcesses: ['proc-123', 'proc-456'],
      alerts: []
    });
    assert(heartbeat.status === 'HEALTHY', 'Sub Manager records active healthy heartbeat');
    assert(heartbeat.activeProcesses.length === 2, 'Sub Manager tracks active background processes');
    assert(typeof heartbeat.lastMonitoredAt === 'string', 'Sub Manager updates monitoring timestamp');
  }

  cleanUp();

  console.log('\n' + '='.repeat(85));
  console.log(`🎉 ALL ${testsPassed} TESTS PASSED CLEANLY! (Failed: ${testsFailed})`);
  console.log('='.repeat(85));
  process.exit(0);

} catch (err) {
  cleanUp();
  console.error('\n❌ TEST RUN FAILED UNEXPECTEDLY:', err);
  process.exit(1);
}
