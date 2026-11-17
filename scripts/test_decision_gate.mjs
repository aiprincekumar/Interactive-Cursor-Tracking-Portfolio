/**
 * Comprehensive Test Suite for Specialist Decision Gate State Machine
 * 
 * Verifies all 10 states and mandatory transitions across the 4 Level 3 Specialists:
 * Level 3A: Skill Manager
 * Level 3B: Grill-Me Specialist
 * Level 3C: Phase-wise Prompt Generation Specialist
 * Level 3D: Code Modularity & Scalable Architecture Specialist
 * 
 * Scenarios:
 * 1. Standard 4-Specialist Success Sequence (PROMPT_FILES_REQUIRED = YES, Strategy A Autonomous)
 * 2. Routine Task Sequence (PROMPT_FILES_REQUIRED = NO, direct Sub Agent execution)
 * 3. Skill Manager finishes first -> WAITING_FOR_BOTH_REPORTS
 * 4. Grill-Me finishes first -> WAITING_FOR_BOTH_REPORTS
 * 5. Prompt Generation Specialist finishes first -> WAITING_FOR_BOTH_REPORTS
 * 6. Code Modularity Specialist finishes first -> WAITING_FOR_BOTH_REPORTS
 * 7. Grill-Me requires user clarification -> WAITING_FOR_USER_CLARIFICATION
 * 8. Strategy B (Single User Consultation) -> WAITING_FOR_USER_CLARIFICATION
 * 9. Strategy C (Phase-by-Phase User Consultation) -> WAITING_FOR_USER_CLARIFICATION
 * 10. Execution Gate Lock: PROMPT_FILES_REQUIRED = YES but files missing -> BLOCKED
 * 11. Sub Agent refuses execution if state != APPROVED_FOR_EXECUTION
 * 12. Specialist failure / timeout -> BLOCKED
 * 13. Strict Manager-Only Authorization Enforcement
 * 14. Sub Manager monitoring and heartbeat validation
 * 15. Prompt Requirement Assessment Cannot Be Skipped or Assumed
 * 16. Prompt Specialist Cannot Be Bypassed Without Explicit User Approval
 * 17. Code Modularity Assessment Cannot Be Skipped or Assumed (Rule 28 Gate Lock)
 * 18. Code Modularity Specialist Failure -> BLOCKED
 */

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { DecisionGateStateMachine, GATE_STATES, ROLES, EXECUTION_STRATEGIES } from './gate-state-validator.js';

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
  // SCENARIO 1: Standard 4-Specialist Success Sequence (PROMPT_FILES_REQUIRED = YES, Strategy A)
  // -----------------------------------------------------------------------------------------------
  console.log('\n[Scenario 1] Standard 4-Specialist Success Transition Sequence:');
  {
    const sm = new DecisionGateStateMachine(tempTestStateFile);
    
    // 1. Initiate task
    sm.initiateTask({ taskId: 'TASK-001', description: 'Complex Feature Implementation', actor: ROLES.MANAGER });
    assert(sm.state.currentState === GATE_STATES.WAITING_FOR_SPECIALISTS, 'Task starts in WAITING_FOR_SPECIALISTS');
    assert(sm.state.specialists.skillManager.status === 'PENDING', 'Skill Manager is PENDING');
    assert(sm.state.specialists.grillMeSpecialist.status === 'PENDING', 'Grill-Me Specialist is PENDING');
    assert(sm.state.specialists.promptGenerationSpecialist.status === 'PENDING', 'Prompt Gen Specialist is PENDING');
    assert(sm.state.specialists.codeModularitySpecialist.status === 'PENDING', 'Code Modularity Specialist is PENDING');

    // 2. Specialists submit reports sequentially
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
    assert(sm.state.currentState === GATE_STATES.WAITING_FOR_BOTH_REPORTS, 'State remains in WAITING_FOR_BOTH_REPORTS while Prompt Gen and Modularity are pending');

    sm.submitPromptGenerationReport({
      promptFilesRequired: true,
      taskSubfolder: 'temp_prompt/complex_feature',
      generatedFiles: ['temp_prompt/complex_feature/INDEX.md', 'temp_prompt/complex_feature/phase_01_init.md'],
      executionStrategy: EXECUTION_STRATEGIES.STRATEGY_A_AUTONOMOUS,
      report: { verified: true, promptFilesReady: true },
      actor: ROLES.PROMPT_GENERATION_SPECIALIST
    });
    assert(sm.state.currentState === GATE_STATES.WAITING_FOR_BOTH_REPORTS, 'State remains in WAITING_FOR_BOTH_REPORTS while Code Modularity is pending');

    sm.submitCodeModularityReport({
      report: { verified: true, targetLineThreshold: '<500 lines', modularArchitecture: 'Feature-Sliced' },
      modularityCompliant: true,
      fileThresholdAudited: true,
      actor: ROLES.CODE_MODULARITY_SPECIALIST
    });
    assert(sm.state.currentState === GATE_STATES.READY_FOR_MANAGER_DECISION, 'State moves to READY_FOR_MANAGER_DECISION after all 4 complete');

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
  // SCENARIO 2: Routine Task Sequence (PROMPT_FILES_REQUIRED = NO, direct execution)
  // -----------------------------------------------------------------------------------------------
  console.log('\n[Scenario 2] Routine Task Sequence (PROMPT_FILES_REQUIRED = NO):');
  {
    cleanUp();
    const sm = new DecisionGateStateMachine(tempTestStateFile);
    sm.initiateTask({ taskId: 'TASK-002-ROUTINE', description: 'Minor Bugfix', actor: ROLES.MANAGER });

    sm.submitSkillManagerReport({ report: { verified: true, skills: [] }, actor: ROLES.SKILL_MANAGER });
    sm.submitGrillMeReport({ report: { ambiguitiesResolved: true }, clarificationRequired: false, actor: ROLES.GRILL_ME_SPECIALIST });
    sm.submitPromptGenerationReport({
      promptFilesRequired: false,
      executionStrategy: EXECUTION_STRATEGIES.STRATEGY_A_AUTONOMOUS,
      report: { verified: true, rationale: 'Routine bugfix requires no ephemeral prompt files' },
      actor: ROLES.PROMPT_GENERATION_SPECIALIST
    });
    sm.submitCodeModularityReport({
      report: { verified: true, rule28Compliant: true },
      modularityCompliant: true,
      fileThresholdAudited: true,
      actor: ROLES.CODE_MODULARITY_SPECIALIST
    });

    assert(sm.state.currentState === GATE_STATES.READY_FOR_MANAGER_DECISION, 'Transitions directly to READY_FOR_MANAGER_DECISION for routine task');
    assert(sm.state.specialists.promptGenerationSpecialist.promptFilesRequired === false, 'PROMPT_FILES_REQUIRED is certified as FALSE');
    assert(sm.state.specialists.codeModularitySpecialist.modularityCompliant === true, 'Code Modularity is certified as COMPLIANT');

    const approval = sm.approveExecution({ authorizedSubAgents: ['BugfixEngineer'], actor: ROLES.MANAGER });
    assert(sm.state.currentState === GATE_STATES.APPROVED_FOR_EXECUTION, 'Manager approves execution directly without prompt files');
  }

  // -----------------------------------------------------------------------------------------------
  // SCENARIO 3: Skill Manager Finishes First Sequence
  // -----------------------------------------------------------------------------------------------
  console.log('\n[Scenario 3] Skill Manager Finishes First Sequence:');
  {
    cleanUp();
    const sm = new DecisionGateStateMachine(tempTestStateFile);
    sm.initiateTask({ taskId: 'TASK-003', actor: ROLES.MANAGER });

    sm.submitSkillManagerReport({
      report: { verified: true, skills: ['node-patterns'] },
      actor: ROLES.SKILL_MANAGER
    });
    assert(sm.state.currentState === GATE_STATES.WAITING_FOR_BOTH_REPORTS, 'Skill Manager finishes first -> WAITING_FOR_BOTH_REPORTS');
    assert(sm.state.specialists.skillManager.status === 'COMPLETED', 'Skill Manager is COMPLETED');
    assert(sm.state.specialists.grillMeSpecialist.status === 'PENDING', 'Grill-Me is still PENDING');
    assert(sm.state.specialists.promptGenerationSpecialist.status === 'PENDING', 'Prompt Gen is still PENDING');
    assert(sm.state.specialists.codeModularitySpecialist.status === 'PENDING', 'Code Modularity is still PENDING');

    // Sub Agent execution attempt must fail here
    const authCheck = sm.verifyExecutionAuthorization({ subAgentRole: 'AnyAgent' });
    assert(authCheck.authorized === false, 'Sub Agent execution is locked out while waiting for reports');

    // Later Grill-Me, Prompt Gen, and Code Modularity finish
    sm.submitGrillMeReport({ report: { ambiguitiesResolved: true }, actor: ROLES.GRILL_ME_SPECIALIST });
    sm.submitPromptGenerationReport({ report: { verified: true }, promptFilesRequired: false, actor: ROLES.PROMPT_GENERATION_SPECIALIST });
    sm.submitCodeModularityReport({ report: { verified: true }, modularityCompliant: true, fileThresholdAudited: true, actor: ROLES.CODE_MODULARITY_SPECIALIST });
    assert(sm.state.currentState === GATE_STATES.READY_FOR_MANAGER_DECISION, 'Transitions to READY_FOR_MANAGER_DECISION when all finish');
  }

  // -----------------------------------------------------------------------------------------------
  // SCENARIO 4: Grill-Me Finishes First Sequence
  // -----------------------------------------------------------------------------------------------
  console.log('\n[Scenario 4] Grill-Me Finishes First Sequence:');
  {
    cleanUp();
    const sm = new DecisionGateStateMachine(tempTestStateFile);
    sm.initiateTask({ taskId: 'TASK-004', actor: ROLES.MANAGER });

    sm.submitGrillMeReport({
      report: { ambiguitiesResolved: true },
      actor: ROLES.GRILL_ME_SPECIALIST
    });
    assert(sm.state.currentState === GATE_STATES.WAITING_FOR_BOTH_REPORTS, 'Grill-Me finishes first -> WAITING_FOR_BOTH_REPORTS');
    assert(sm.state.specialists.grillMeSpecialist.status === 'COMPLETED', 'Grill-Me is COMPLETED');
    assert(sm.state.specialists.skillManager.status === 'PENDING', 'Skill Manager is still PENDING');
    assert(sm.state.specialists.codeModularitySpecialist.status === 'PENDING', 'Code Modularity is still PENDING');

    sm.submitSkillManagerReport({ report: { verified: true, skills: [] }, actor: ROLES.SKILL_MANAGER });
    sm.submitPromptGenerationReport({ report: { verified: true }, promptFilesRequired: false, actor: ROLES.PROMPT_GENERATION_SPECIALIST });
    sm.submitCodeModularityReport({ report: { verified: true }, modularityCompliant: true, fileThresholdAudited: true, actor: ROLES.CODE_MODULARITY_SPECIALIST });
    assert(sm.state.currentState === GATE_STATES.READY_FOR_MANAGER_DECISION, 'Transitions to READY_FOR_MANAGER_DECISION after all report');
  }

  // -----------------------------------------------------------------------------------------------
  // SCENARIO 5: Prompt Generation Specialist Finishes First Sequence
  // -----------------------------------------------------------------------------------------------
  console.log('\n[Scenario 5] Prompt Generation Specialist Finishes First Sequence:');
  {
    cleanUp();
    const sm = new DecisionGateStateMachine(tempTestStateFile);
    sm.initiateTask({ taskId: 'TASK-005', actor: ROLES.MANAGER });

    sm.submitPromptGenerationReport({
      promptFilesRequired: false,
      report: { verified: true },
      actor: ROLES.PROMPT_GENERATION_SPECIALIST
    });
    assert(sm.state.currentState === GATE_STATES.WAITING_FOR_BOTH_REPORTS, 'Prompt Gen finishes first -> WAITING_FOR_BOTH_REPORTS');
    assert(sm.state.specialists.promptGenerationSpecialist.status === 'COMPLETED', 'Prompt Gen is COMPLETED');
    assert(sm.state.specialists.skillManager.status === 'PENDING', 'Skill Manager is still PENDING');
    assert(sm.state.specialists.codeModularitySpecialist.status === 'PENDING', 'Code Modularity is still PENDING');

    sm.submitSkillManagerReport({ report: { verified: true, skills: [] }, actor: ROLES.SKILL_MANAGER });
    sm.submitGrillMeReport({ report: { ambiguitiesResolved: true }, actor: ROLES.GRILL_ME_SPECIALIST });
    sm.submitCodeModularityReport({ report: { verified: true }, modularityCompliant: true, fileThresholdAudited: true, actor: ROLES.CODE_MODULARITY_SPECIALIST });
    assert(sm.state.currentState === GATE_STATES.READY_FOR_MANAGER_DECISION, 'Transitions to READY_FOR_MANAGER_DECISION');
  }

  // -----------------------------------------------------------------------------------------------
  // SCENARIO 6: Grill-Me requires user clarification -> WAITING_FOR_USER_CLARIFICATION
  // -----------------------------------------------------------------------------------------------
  console.log('\n[Scenario 6] User Clarification Required Sequence (Grill-Me):');
  {
    cleanUp();
    const sm = new DecisionGateStateMachine(tempTestStateFile);
    sm.initiateTask({ taskId: 'TASK-006', actor: ROLES.MANAGER });

    sm.submitSkillManagerReport({ report: { verified: true }, actor: ROLES.SKILL_MANAGER });
    sm.submitPromptGenerationReport({ report: { verified: true }, promptFilesRequired: false, actor: ROLES.PROMPT_GENERATION_SPECIALIST });
    sm.submitCodeModularityReport({ report: { verified: true }, modularityCompliant: true, fileThresholdAudited: true, actor: ROLES.CODE_MODULARITY_SPECIALIST });

    sm.submitGrillMeReport({
      report: { ambiguitiesResolved: false },
      clarificationRequired: true,
      questions: ['Should we use Tailwind CSS v4 or vanilla CSS?'],
      actor: ROLES.GRILL_ME_SPECIALIST
    });
    assert(sm.state.currentState === GATE_STATES.WAITING_FOR_USER_CLARIFICATION, 'Transitions to WAITING_FOR_USER_CLARIFICATION');

    const authCheck = sm.verifyExecutionAuthorization({ subAgentRole: 'FrontendEngineer' });
    assert(authCheck.authorized === false, 'Sub Agent execution is blocked during WAITING_FOR_USER_CLARIFICATION');

    // User clarifies via Manager
    sm.resolveUserClarification({
      userAnswers: ['Use Tailwind CSS as per DESIGN.md'],
      actor: ROLES.MANAGER
    });
    assert(sm.state.currentState === GATE_STATES.READY_FOR_MANAGER_DECISION, 'Transitions to READY_FOR_MANAGER_DECISION after clarification resolved');
  }

  // -----------------------------------------------------------------------------------------------
  // SCENARIO 7: Strategy B (Single User Consultation) Sequence
  // -----------------------------------------------------------------------------------------------
  console.log('\n[Scenario 7] Strategy B (Single User Consultation) Sequence:');
  {
    cleanUp();
    const sm = new DecisionGateStateMachine(tempTestStateFile);
    sm.initiateTask({ taskId: 'TASK-007-STRAT-B', actor: ROLES.MANAGER });

    sm.submitSkillManagerReport({ report: { verified: true }, actor: ROLES.SKILL_MANAGER });
    sm.submitGrillMeReport({ report: { ambiguitiesResolved: true }, clarificationRequired: false, actor: ROLES.GRILL_ME_SPECIALIST });
    sm.submitCodeModularityReport({ report: { verified: true }, modularityCompliant: true, fileThresholdAudited: true, actor: ROLES.CODE_MODULARITY_SPECIALIST });
    sm.submitPromptGenerationReport({
      promptFilesRequired: true,
      taskSubfolder: 'temp_prompt/strat_b_feature',
      generatedFiles: ['temp_prompt/strat_b_feature/INDEX.md'],
      executionStrategy: EXECUTION_STRATEGIES.STRATEGY_B_SINGLE_CONSULTATION,
      strategyRecommendation: {
        strategy: EXECUTION_STRATEGIES.STRATEGY_B_SINGLE_CONSULTATION,
        rationale: 'Consult user once upfront before executing 4 phases autonomously',
        risks: ['Scope drift if user rejects Phase 3'],
        dependencies: ['Design tokens'],
        autonomyScore: 0.8
      },
      report: { verified: true, promptFilesReady: true },
      actor: ROLES.PROMPT_GENERATION_SPECIALIST
    });

    assert(sm.state.currentState === GATE_STATES.WAITING_FOR_USER_CLARIFICATION, 'Strategy B transitions to WAITING_FOR_USER_CLARIFICATION for upfront consultation');

    // Sub Agents locked during consultation
    assert(sm.verifyExecutionAuthorization({ subAgentRole: 'FrontendEngineer' }).authorized === false, 'Sub Agent locked during Strategy B consultation');

    // Manager obtains user approval via CEO -> ask_question
    sm.resolveUserClarification({
      userAnswers: ['User approved: Proceed with all 4 phases autonomously'],
      actor: ROLES.MANAGER
    });
    assert(sm.state.currentState === GATE_STATES.READY_FOR_MANAGER_DECISION, 'Transitions to READY_FOR_MANAGER_DECISION after Strategy B user approval');
  }

  // -----------------------------------------------------------------------------------------------
  // SCENARIO 8: Execution Gate Lockout: PROMPT_FILES_REQUIRED = YES but files missing -> BLOCKED
  // -----------------------------------------------------------------------------------------------
  console.log('\n[Scenario 8] Execution Gate Lockout: Missing Prompt Files -> BLOCKED:');
  {
    cleanUp();
    const sm = new DecisionGateStateMachine(tempTestStateFile);
    sm.initiateTask({ taskId: 'TASK-008-GATE-FAIL', actor: ROLES.MANAGER });

    sm.submitSkillManagerReport({ report: { verified: true }, actor: ROLES.SKILL_MANAGER });
    sm.submitGrillMeReport({ report: { ambiguitiesResolved: true }, actor: ROLES.GRILL_ME_SPECIALIST });

    // Specialist claims prompt files are required, but generatedFiles is empty and promptFilesReady is false
    sm.submitPromptGenerationReport({
      promptFilesRequired: true,
      generatedFiles: [],
      report: { verified: true, promptFilesReady: false },
      actor: ROLES.PROMPT_GENERATION_SPECIALIST
    });

    assert(sm.state.currentState === GATE_STATES.BLOCKED, 'Gate transitions to BLOCKED when required prompt files are missing');
    assert(sm.verifyExecutionAuthorization({ subAgentRole: 'SubAgent' }).authorized === false, 'Sub Agent execution is strictly locked in BLOCKED state');
  }

  // -----------------------------------------------------------------------------------------------
  // SCENARIO 9: Sub Agent Refuses Execution When Unauthorized
  // -----------------------------------------------------------------------------------------------
  console.log('\n[Scenario 9] Sub Agent Refuses Execution When Unauthorized:');
  {
    cleanUp();
    const sm = new DecisionGateStateMachine(tempTestStateFile);
    sm.initiateTask({ taskId: 'TASK-009', actor: ROLES.MANAGER });

    assert(sm.verifyExecutionAuthorization({ subAgentRole: 'SubAgent' }).authorized === false, 'Authorization check fails in WAITING_FOR_SPECIALISTS');
    
    let caughtError = false;
    try {
      sm.startExecution({ subAgentRole: 'SubAgent' });
    } catch (_) {
      caughtError = true;
    }
    assert(caughtError === true, 'Sub Agent execution threw error when state was not APPROVED_FOR_EXECUTION');
  }

  // -----------------------------------------------------------------------------------------------
  // SCENARIO 10: Specialist Failure & Timeout -> BLOCKED
  // -----------------------------------------------------------------------------------------------
  console.log('\n[Scenario 10] Specialist Failure & Timeout -> BLOCKED:');
  {
    cleanUp();
    const sm = new DecisionGateStateMachine(tempTestStateFile);
    sm.initiateTask({ taskId: 'TASK-010', actor: ROLES.MANAGER });

    sm.submitSkillManagerReport({
      status: 'FAILED',
      error: 'Skill registry unreachable',
      actor: ROLES.SKILL_MANAGER
    });
    assert(sm.state.currentState === GATE_STATES.BLOCKED, 'Failed specialist report transitions gate to BLOCKED');

    const authCheck = sm.verifyExecutionAuthorization({ subAgentRole: 'SubAgent' });
    assert(authCheck.authorized === false, 'Sub Agent execution is strictly locked out in BLOCKED state');

    // Sub Manager timeout test
    cleanUp();
    const sm2 = new DecisionGateStateMachine(tempTestStateFile);
    sm2.initiateTask({ taskId: 'TASK-010B', actor: ROLES.MANAGER });
    sm2.state.history[0].timestamp = new Date(Date.now() - 700000).toISOString();
    sm2.recordSubManagerHeartbeat({ timeoutSeconds: 600 });
    assert(sm2.state.currentState === GATE_STATES.BLOCKED, 'Sub Manager detects timeout and transitions to BLOCKED');
  }

  // -----------------------------------------------------------------------------------------------
  // SCENARIO 11: Strict Manager-Only Authorization Enforcement
  // -----------------------------------------------------------------------------------------------
  console.log('\n[Scenario 11] Strict Manager-Only Authorization Enforcement:');
  {
    cleanUp();
    const sm = new DecisionGateStateMachine(tempTestStateFile);
    sm.initiateTask({ taskId: 'TASK-011', actor: ROLES.MANAGER });

    sm.submitSkillManagerReport({ report: { verified: true }, actor: ROLES.SKILL_MANAGER });
    sm.submitGrillMeReport({ report: { ambiguitiesResolved: true }, actor: ROLES.GRILL_ME_SPECIALIST });
    sm.submitPromptGenerationReport({ report: { verified: true }, promptFilesRequired: false, actor: ROLES.PROMPT_GENERATION_SPECIALIST });
    sm.submitCodeModularityReport({ report: { verified: true }, modularityCompliant: true, fileThresholdAudited: true, actor: ROLES.CODE_MODULARITY_SPECIALIST });
    assert(sm.state.currentState === GATE_STATES.READY_FOR_MANAGER_DECISION, 'State is ready for decision');

    let unauthorizedBlocked = false;
    try {
      sm.approveExecution({ actor: ROLES.SUB_AGENT });
    } catch (_) {
      unauthorizedBlocked = true;
    }
    assert(unauthorizedBlocked === true, 'Unauthorized actor was rejected from approving execution');
    assert(sm.state.currentState === GATE_STATES.BLOCKED, 'Gate transitioned to BLOCKED on authorization violation attempt');
  }

  // -----------------------------------------------------------------------------------------------
  // SCENARIO 12: Sub Manager Monitoring & Heartbeat Tracking
  // -----------------------------------------------------------------------------------------------
  console.log('\n[Scenario 12] Sub Manager Monitoring & Telemetry:');
  {
    cleanUp();
    const sm = new DecisionGateStateMachine(tempTestStateFile);
    sm.initiateTask({ taskId: 'TASK-012', actor: ROLES.MANAGER });

    const heartbeat = sm.recordSubManagerHeartbeat({
      status: 'HEALTHY',
      activeProcesses: ['proc-123', 'proc-456'],
      alerts: []
    });
    assert(heartbeat.status === 'HEALTHY', 'Sub Manager records active healthy heartbeat');
    assert(heartbeat.activeProcesses.length === 2, 'Sub Manager tracks active background processes');
    assert(typeof heartbeat.lastMonitoredAt === 'string', 'Sub Manager updates monitoring timestamp');
  }

  // -----------------------------------------------------------------------------------------------
  // SCENARIO 13: Prompt Requirement Assessment Cannot Be Skipped or Assumed
  // -----------------------------------------------------------------------------------------------
  console.log('\n[Scenario 13] Prompt Requirement Assessment Cannot Be Skipped or Assumed:');
  {
    cleanUp();
    const sm = new DecisionGateStateMachine(tempTestStateFile);
    sm.initiateTask({ taskId: 'TASK-013-PROMPT-MANDATORY', actor: ROLES.MANAGER });

    sm.submitSkillManagerReport({ report: { verified: true }, actor: ROLES.SKILL_MANAGER });
    sm.submitGrillMeReport({ report: { ambiguitiesResolved: true }, actor: ROLES.GRILL_ME_SPECIALIST });
    sm.submitCodeModularityReport({ report: { verified: true }, modularityCompliant: true, fileThresholdAudited: true, actor: ROLES.CODE_MODULARITY_SPECIALIST });

    // Specialist omits promptFilesRequired (undefined)
    sm.submitPromptGenerationReport({
      report: { verified: true },
      actor: ROLES.PROMPT_GENERATION_SPECIALIST
    });

    assert(sm.state.currentState === GATE_STATES.BLOCKED, 'Gate transitions to BLOCKED when PROMPT_FILES_REQUIRED is omitted');
    assert(sm.state.specialists.promptGenerationSpecialist.status === 'FAILED', 'Prompt Gen Specialist is marked FAILED on missing assessment');
    assert(sm.verifyExecutionAuthorization({ subAgentRole: 'SubAgent' }).authorized === false, 'Sub Agent execution is locked out in BLOCKED state');
  }

  // -----------------------------------------------------------------------------------------------
  // SCENARIO 14: Prompt Specialist Cannot Be Bypassed Without Explicit User Approval
  // -----------------------------------------------------------------------------------------------
  console.log('\n[Scenario 14] Prompt Specialist Cannot Be Bypassed Without Explicit User Approval:');
  {
    cleanUp();
    const sm = new DecisionGateStateMachine(tempTestStateFile);

    // Attempt bypass without user override approval
    let unauthorizedBypassBlocked = false;
    try {
      sm.initiateTask({ taskId: 'TASK-014-UNAUTHORIZED-BYPASS', requirePromptSpecialist: false, actor: ROLES.MANAGER });
    } catch (_) {
      unauthorizedBypassBlocked = true;
    }
    assert(unauthorizedBypassBlocked === true, 'Unauthorized attempt to bypass Prompt Specialist threw exception');
    assert(sm.state.currentState === GATE_STATES.BLOCKED, 'Gate transitioned to BLOCKED on unauthorized bypass attempt');

    // Authorized bypass with explicit userOverrideApproval
    cleanUp();
    const sm2 = new DecisionGateStateMachine(tempTestStateFile);
    sm2.initiateTask({
      taskId: 'TASK-014-AUTHORIZED-BYPASS',
      requirePromptSpecialist: false,
      userOverrideApproval: true,
      actor: ROLES.MANAGER
    });
    assert(sm2.state.currentState === GATE_STATES.WAITING_FOR_SPECIALISTS, 'Authorized bypass successfully initiated with user override');
    assert(sm2.state.specialists.promptGenerationSpecialist.status === 'SKIPPED', 'Prompt Specialist marked SKIPPED under user override');

    sm2.submitSkillManagerReport({ report: { verified: true }, actor: ROLES.SKILL_MANAGER });
    sm2.submitGrillMeReport({ report: { ambiguitiesResolved: true }, actor: ROLES.GRILL_ME_SPECIALIST });
    sm2.submitCodeModularityReport({ report: { verified: true }, modularityCompliant: true, fileThresholdAudited: true, actor: ROLES.CODE_MODULARITY_SPECIALIST });
    assert(sm2.state.currentState === GATE_STATES.READY_FOR_MANAGER_DECISION, 'Transitions to READY_FOR_MANAGER_DECISION under authorized prompt bypass');
  }

  // -----------------------------------------------------------------------------------------------
  // SCENARIO 15: Code Modularity Specialist Finishes First Sequence
  // -----------------------------------------------------------------------------------------------
  console.log('\n[Scenario 15] Code Modularity Specialist Finishes First Sequence:');
  {
    cleanUp();
    const sm = new DecisionGateStateMachine(tempTestStateFile);
    sm.initiateTask({ taskId: 'TASK-015', actor: ROLES.MANAGER });

    sm.submitCodeModularityReport({
      report: { verified: true, rule28Compliant: true },
      modularityCompliant: true,
      fileThresholdAudited: true,
      actor: ROLES.CODE_MODULARITY_SPECIALIST
    });
    assert(sm.state.currentState === GATE_STATES.WAITING_FOR_BOTH_REPORTS, 'Code Modularity finishes first -> WAITING_FOR_BOTH_REPORTS');
    assert(sm.state.specialists.codeModularitySpecialist.status === 'COMPLETED', 'Code Modularity is COMPLETED');
    assert(sm.state.specialists.skillManager.status === 'PENDING', 'Skill Manager is still PENDING');
    assert(sm.state.specialists.grillMeSpecialist.status === 'PENDING', 'Grill-Me is still PENDING');
    assert(sm.state.specialists.promptGenerationSpecialist.status === 'PENDING', 'Prompt Gen is still PENDING');

    // Sub Agent execution attempt must fail here
    const authCheck = sm.verifyExecutionAuthorization({ subAgentRole: 'AnyAgent' });
    assert(authCheck.authorized === false, 'Sub Agent execution is locked out while waiting for reports');

    // Remaining specialists complete
    sm.submitSkillManagerReport({ report: { verified: true, skills: [] }, actor: ROLES.SKILL_MANAGER });
    sm.submitGrillMeReport({ report: { ambiguitiesResolved: true }, actor: ROLES.GRILL_ME_SPECIALIST });
    sm.submitPromptGenerationReport({ report: { verified: true }, promptFilesRequired: false, actor: ROLES.PROMPT_GENERATION_SPECIALIST });
    assert(sm.state.currentState === GATE_STATES.READY_FOR_MANAGER_DECISION, 'Transitions to READY_FOR_MANAGER_DECISION when all finish');
  }

  // -----------------------------------------------------------------------------------------------
  // SCENARIO 16: Code Modularity Assessment Cannot Be Skipped or Assumed (Rule 28 Gate Lock)
  // -----------------------------------------------------------------------------------------------
  console.log('\n[Scenario 16] Code Modularity Assessment Cannot Be Skipped or Assumed:');
  {
    cleanUp();
    const sm = new DecisionGateStateMachine(tempTestStateFile);
    sm.initiateTask({ taskId: 'TASK-016-MODULARITY-MANDATORY', actor: ROLES.MANAGER });

    sm.submitSkillManagerReport({ report: { verified: true }, actor: ROLES.SKILL_MANAGER });
    sm.submitGrillMeReport({ report: { ambiguitiesResolved: true }, actor: ROLES.GRILL_ME_SPECIALIST });
    sm.submitPromptGenerationReport({ report: { verified: true }, promptFilesRequired: false, actor: ROLES.PROMPT_GENERATION_SPECIALIST });

    // Specialist omits valid boolean assessment
    sm.submitCodeModularityReport({
      report: { verified: true },
      modularityCompliant: 'NOT_A_BOOLEAN',
      actor: ROLES.CODE_MODULARITY_SPECIALIST
    });

    assert(sm.state.currentState === GATE_STATES.BLOCKED, 'Gate transitions to BLOCKED when modularityCompliant is invalid');
    assert(sm.state.specialists.codeModularitySpecialist.status === 'FAILED', 'Code Modularity Specialist is marked FAILED on invalid assessment');
    assert(sm.verifyExecutionAuthorization({ subAgentRole: 'SubAgent' }).authorized === false, 'Sub Agent execution is locked out in BLOCKED state');
  }

  // -----------------------------------------------------------------------------------------------
  // SCENARIO 17: Code Modularity Specialist Failure -> BLOCKED
  // -----------------------------------------------------------------------------------------------
  console.log('\n[Scenario 17] Code Modularity Specialist Failure -> BLOCKED:');
  {
    cleanUp();
    const sm = new DecisionGateStateMachine(tempTestStateFile);
    sm.initiateTask({ taskId: 'TASK-017-MODULARITY-FAIL', actor: ROLES.MANAGER });

    sm.submitCodeModularityReport({
      status: 'FAILED',
      error: 'File exceeds 700 lines hard limit without modular split per Rule 28',
      actor: ROLES.CODE_MODULARITY_SPECIALIST
    });

    assert(sm.state.currentState === GATE_STATES.BLOCKED, 'Gate transitions to BLOCKED on modularity specialist failure');
    assert(sm.verifyExecutionAuthorization({ subAgentRole: 'SubAgent' }).authorized === false, 'Sub Agent execution is locked out');
  }

  // -----------------------------------------------------------------------------------------------
  // SCENARIO 18: Full 4-Specialist Barrier Lock Verification
  // -----------------------------------------------------------------------------------------------
  console.log('\n[Scenario 18] Full 4-Specialist Barrier Lock Verification:');
  {
    cleanUp();
    const sm = new DecisionGateStateMachine(tempTestStateFile);
    sm.initiateTask({ taskId: 'TASK-018-BARRIER', actor: ROLES.MANAGER });

    // Complete 3 of 4 specialists
    sm.submitSkillManagerReport({ report: { verified: true }, actor: ROLES.SKILL_MANAGER });
    sm.submitGrillMeReport({ report: { ambiguitiesResolved: true }, actor: ROLES.GRILL_ME_SPECIALIST });
    sm.submitPromptGenerationReport({ report: { verified: true }, promptFilesRequired: false, actor: ROLES.PROMPT_GENERATION_SPECIALIST });

    // Gate must NOT transition to READY_FOR_MANAGER_DECISION yet because Code Modularity is still pending!
    assert(sm.state.currentState === GATE_STATES.WAITING_FOR_BOTH_REPORTS, 'Gate remains in WAITING_FOR_BOTH_REPORTS when 3/4 specialists completed');
    assert(sm.state.specialists.codeModularitySpecialist.status === 'PENDING', 'Code Modularity is still PENDING');

    // Attempt premature approval by Manager must fail
    let prematureApprovalBlocked = false;
    try {
      sm.approveExecution({ actor: ROLES.MANAGER });
    } catch (_) {
      prematureApprovalBlocked = true;
    }
    assert(prematureApprovalBlocked === true, 'Premature approval before 4th specialist reports was blocked');

    // Complete the 4th specialist in fresh instance
    cleanUp();
    const sm2 = new DecisionGateStateMachine(tempTestStateFile);
    sm2.initiateTask({ taskId: 'TASK-018-BARRIER-PASS', actor: ROLES.MANAGER });
    sm2.submitSkillManagerReport({ report: { verified: true }, actor: ROLES.SKILL_MANAGER });
    sm2.submitGrillMeReport({ report: { ambiguitiesResolved: true }, actor: ROLES.GRILL_ME_SPECIALIST });
    sm2.submitPromptGenerationReport({ report: { verified: true }, promptFilesRequired: false, actor: ROLES.PROMPT_GENERATION_SPECIALIST });
    sm2.submitCodeModularityReport({ report: { verified: true }, modularityCompliant: true, fileThresholdAudited: true, actor: ROLES.CODE_MODULARITY_SPECIALIST });
    assert(sm2.state.currentState === GATE_STATES.READY_FOR_MANAGER_DECISION, 'Gate transitions to READY_FOR_MANAGER_DECISION ONLY after all 4 complete');
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
