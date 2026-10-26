const fs = require('fs');
const path = require('path');

const widgetPath = path.resolve('src/components/AIChatWidget.jsx');
let code = fs.readFileSync(widgetPath, 'utf8');

// 1. Add Clock and Zap to lucide-react imports if not present
if (!code.includes('Clock,') && !code.includes('Clock\n') && !code.includes('Clock\r\n')) {
  code = code.replace(/Bot\r?\n\} from 'lucide-react';/, 'Bot,\r\n  Clock,\r\n  Zap\r\n} from \'lucide-react\';');
}

// 2. Add lastHandledDownloadRef
if (!code.includes('lastHandledDownloadRef')) {
  code = code.replace(
    /const lastDowngradedRef = useRef\(null\);/,
    'const lastHandledDownloadRef = useRef(null);\r\n  const lastDowngradedRef = useRef(null);'
  );
}

// 3. Update localAIService.subscribe to handle download_complete
if (!code.includes("notif.type === 'download_complete'")) {
  const oldSubscribe = `      if (state.lastNotification) {
        const notif = state.lastNotification;
        if (notif.type === 'ready') {`;

  const newSubscribe = `      if (state.lastNotification) {
        const notif = state.lastNotification;
        if (notif.type === 'download_complete') {
          const modelShortcut = notif.shortcut || notif.model?.shortcut || localAIService.getShortcutForModelId(notif.modelId);
          const modelId = notif.modelId || notif.model?.id;
          if (lastHandledDownloadRef.current !== modelId) {
            lastHandledDownloadRef.current = modelId;
            const decisionTreeMsg = {
              id: \`assistant-download-complete-\${Date.now()}\`,
              sender: 'assistant',
              modelShortcut,
              text: \`🎉 **AI मॉडल \${modelShortcut} सफलतापूर्वक डाउनलोड हो गया है!**\\n\\nयह आपके ब्राउज़र कैशे में 100% सुरक्षित और तैयार है। क्या आप इसे अभी एक्टिवेट करना चाहते हैं?\`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              decisionTree: {
                step: 'ai_model_activation',
                title: 'AI मॉडल एक्टिवेशन / Model Activation:',
                modelId,
                options: [
                  {
                    id: 'activate_yes',
                    label: '⚡ हाँ, एक्टिवेट करो / Yes, Activate Now',
                    action: 'activate',
                    modelId,
                    shortcut: modelShortcut,
                    isActivationYes: true
                  },
                  {
                    id: 'activate_no',
                    label: '⏳ नहीं, अभी रहने दो / No, Later',
                    action: 'later',
                    modelId,
                    shortcut: modelShortcut,
                    isActivationNo: true
                  }
                ]
              }
            };
            setMessages((prev) => [...prev, decisionTreeMsg]);
            if (soundEnabled && soundFX?.playSuccess) soundFX.playSuccess();
            setTimeout(scrollToBottom, 50);
          }
        } else if (notif.type === 'ready') {`;

  // normalize crlf
  const oldSubscribeCRLF = oldSubscribe.replace(/\n/g, '\r\n');
  const newSubscribeCRLF = newSubscribe.replace(/\n/g, '\r\n');
  if (code.includes(oldSubscribeCRLF)) {
    code = code.replace(oldSubscribeCRLF, newSubscribeCRLF);
  } else if (code.includes(oldSubscribe)) {
    code = code.replace(oldSubscribe, newSubscribe);
  } else {
    console.warn('Could not find subscribe block directly; trying regex');
    code = code.replace(
      /if \(state\.lastNotification\) \{\r?\n\s+const notif = state\.lastNotification;\r?\n\s+if \(notif\.type === 'ready'\) \{/,
      newSubscribeCRLF
    );
  }
}

// 4. Update handleTriggerAIModelDecisionTree to exclude bare minimum model (SmolLM-135M)
const oldTriggerPattern = /\/\*\*[\s\S]*?\* Triggers in-chat AI Model Decision Tree with 4 dynamic cards[\s\S]*?const options = \[[\s\S]*?\{[\s\S]*?isTurnOff: true[\s\S]*?\}\r?\n\s+\];/;
const newTriggerCode = `/**
   * Triggers in-chat AI Model Decision Tree with dynamic cards (SmolLM-135M excluded from user choices)
   */
  const handleTriggerAIModelDecisionTree = () => {
    if (soundEnabled && soundFX?.playTap) soundFX.playTap();

    const deviceProfile = localAiState?.deviceProfile;
    let recommended = deviceProfile?.recommendedModel;
    if (!recommended || recommended.id === MODEL_CATALOG.BARE_MINIMUM.id) {
      recommended = MODEL_CATALOG.MEDIUM;
    }

    const options = [
      {
        id: recommended.id,
        modelId: recommended.id,
        shortcut: recommended.shortcut,
        label: \`🚀 डिवाइस-अनुशंसित मॉडल (\${recommended.shortcut})\`,
        sublabel: \`\${recommended.name} • ~\${recommended.approxSizeMB || 950}MB • डिवाइस के लिए अनुशंसित सटीकता\`,
        isRecommended: true
      }
    ];

    if (recommended.id !== MODEL_CATALOG.LIGHT.id) {
      options.push({
        id: MODEL_CATALOG.LIGHT.id,
        modelId: MODEL_CATALOG.LIGHT.id,
        shortcut: MODEL_CATALOG.LIGHT.shortcut,
        label: \`⚖️ बैलेंस्ड लाइट मॉडल (\${MODEL_CATALOG.LIGHT.shortcut})\`,
        sublabel: \`\${MODEL_CATALOG.LIGHT.name} • ~\${MODEL_CATALOG.LIGHT.approxSizeMB}MB • तेज़ गति व संतुलित रिस्पॉन्स\`,
        isMid: true
      });
    }

    options.push({
      id: 'portfolio-engine',
      modelId: 'portfolio-engine',
      shortcut: '[Portfolio-Engine]',
      label: '🔌 AI ऑफ करें / Turn Off AI',
      sublabel: '100% ऑफलाइन डिटर्मिनिस्टिक नॉलेज इंजन [Portfolio-Engine] • 0MB',
      isTurnOff: true
    });`.replace(/\n/g, '\r\n');

code = code.replace(oldTriggerPattern, newTriggerCode);

// 5. Add handleAiModelActivationSelect
if (!code.includes('handleAiModelActivationSelect')) {
  const activationHandlerCode = `

  /**
   * Handles user decision from Post-Download Activation Decision Tree
   */
  const handleAiModelActivationSelect = (chip) => {
    if (soundEnabled && soundFX?.playTap) soundFX.playTap();

    const userMsg = {
      id: \`user-ai-activation-\${Date.now()}\`,
      sender: 'user',
      text: chip.label,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    if (chip.isActivationYes || chip.action === 'activate') {
      localAIService.activateModel(chip.modelId);
      const assistantMsg = {
        id: \`assistant-ai-activated-\${Date.now()}\`,
        sender: 'assistant',
        modelShortcut: chip.shortcut || localAIService.getShortcutForModelId(chip.modelId),
        text: \`⚡ **AI मॉडल \${chip.shortcut || ''} सक्रिय कर दिया गया है!**\\n\\nअब ऑन-डिवाइस न्यूरल मॉडल सक्रिय है। पोर्टफोलियो ज्ञान के अलावा आप सामान्य प्रश्न भी पूछ सकते हैं! 100% क्लाइंट-साइड व सुरक्षित।\`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        chips: PROMPT_CHIPS
      };
      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      if (soundEnabled && soundFX?.playSuccess) soundFX.playSuccess();
      announce('On-Device AI model activated successfully', 'polite');
    } else {
      const assistantMsg = {
        id: \`assistant-ai-later-\${Date.now()}\`,
        sender: 'assistant',
        modelShortcut: localAiState?.activeModel?.shortcut || '[Portfolio-Engine]',
        text: \`👍 **ठीक है! मॉडल कैशे में सुरक्षित रहेगा।**\\n\\nवर्तमान मोड जारी रहेगा। आप जब चाहें हेडर में दिए गए मॉडल स्विच आइकन (🤖) से इसे कभी भी सक्रिय कर सकते हैं।\`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        chips: PROMPT_CHIPS
      };
      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      if (soundEnabled && soundFX?.playTap) soundFX.playTap();
      announce('Model cached for later activation. Current mode retained.', 'polite');
    }
    setTimeout(scrollToBottom, 50);
  };`.replace(/\n/g, '\r\n');

  code = code.replace(
    /const handleAiModelSwitchSelect = \(chip\) => \{/,
    activationHandlerCode.trim() + '\r\n\r\n  const handleAiModelSwitchSelect = (chip) => {'
  );
}

// 6. Update handleSendMessage for hybrid smart inference
const oldSendPattern = /\/\/ Handle message submission\r?\n\s+const handleSendMessage = \(textToSend\) => \{[\s\S]*?setIsTyping\(false\);\r?\n\s+\}\r?\n\s+\}, 400\);\r?\n\s+\};/;
const newSendCode = `// Handle message submission with Hybrid Smart Inference
  const handleSendMessage = async (textToSend) => {
    const trimmed = (textToSend || inputValue).trim();
    if (!trimmed || isTyping) return;

    if (soundEnabled && soundFX?.playTap) {
      soundFX.playTap();
    }

    const newMsg = {
      id: \`user-\${Date.now()}\`,
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputValue('');
    setIsTyping(true);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // 250ms natural AI thinking delay
    await new Promise((resolve) => {
      typingTimeoutRef.current = setTimeout(resolve, 250);
    });

    try {
      let response = null;
      let botReplyText = '';
      let botChips = null;
      let botActions = null;

      try {
        if (typeof queryAssistant === 'function') {
          response = queryAssistant(trimmed, { role: activeRole, audience });
          if (response) {
            botReplyText = response.text || '';
            botChips = response.chips || null;
            botActions = response.actions || null;
          }
        }
      } catch (err) {
        console.warn('queryAssistant exception:', err);
      }

      const isAiActive = localAiState?.status === 'ready' && localAiState?.activeModel && localAiState?.isAiEnabled !== false;
      const isPortfolioKnowledgeMatched = response && response.intent && response.intent !== 'fallback' && (response.confidence === undefined || response.confidence >= 0.5);

      const activeBadge = isAiActive
        ? (localAiState?.activeModel?.shortcut || '[On-Device AI]')
        : '[Portfolio-Engine]';

      if (isAiActive && !isPortfolioKnowledgeMatched) {
        // Unmatched / General query -> Dispatch to on-device neural model via localAIService.generateText
        try {
          const aiResult = await localAIService.generateText(trimmed);
          if (aiResult && aiResult.text) {
            botReplyText = aiResult.text.trim();
          }
        } catch (genErr) {
          console.warn('[AIChatWidget] Local AI generation fallback:', genErr);
        }
      }

      if (!botReplyText) {
        botReplyText = generateBotReply(trimmed);
        botChips = PROMPT_CHIPS;
      }

      const assistantMessage = {
        id: (response && response.id) || \`assistant-\${Date.now()}\`,
        sender: 'assistant',
        modelShortcut: activeBadge,
        text: (isAiActive && !isPortfolioKnowledgeMatched && botReplyText) ? botReplyText : ((response && response.text) || botReplyText),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        chips: (response && response.chips) || botChips || PROMPT_CHIPS,
        actions: (response && response.actions) || botActions || [],
        decisionTree: (response && response.decisionTree) || null
      };

      setMessages((prev) => [...prev, assistantMessage]);
      const cleanForA11y = (str) =>
        typeof str === 'string'
          ? str.replace(/[*#_~•\`]/g, ' ').replace(/\\s+/g, ' ').trim()
          : '';
      setLiveAnnouncement(cleanForA11y(assistantMessage.text));
      announce(assistantMessage.text, 'polite');

      if (soundEnabled && soundFX?.playFocusBeep) {
        soundFX.playFocusBeep();
      }
    } finally {
      setIsTyping(false);
      setTimeout(scrollToBottom, 50);
    }
  };`.replace(/\n/g, '\r\n');

code = code.replace(oldSendPattern, newSendCode);

// 7. Remove Active AI Mode Banner / Status Bar (lines ~2299 to 2368)
const bannerPattern = /\r?\n\s+\{\/\* Active AI Mode Banner \/ Status Bar \*\/\}[\s\S]*?aria-label="Active AI Engine Mode"[\s\S]*?<\/div>\r?\n\s+<\/div>/;
code = code.replace(bannerPattern, '');

// 8. Add decision tree rendering for ai_model_activation
if (!code.includes("msg.decisionTree?.step === 'ai_model_activation'")) {
  const activationRenderCode = `if (msg.decisionTree?.step === 'ai_model_activation' || chip.isActivationYes || chip.isActivationNo) {
                                  const isYes = chip.isActivationYes || chip.action === 'activate';
                                  return (
                                    <button
                                      key={chip.id}
                                      type="button"
                                      onClick={() => handleAiModelActivationSelect(chip)}
                                      className={\`w-full py-2.5 px-3 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer text-left flex items-center justify-between shadow-2xs border \${
                                        isYes
                                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 shadow-emerald-500/20'
                                          : 'bg-white dark:bg-[#1E162B] text-stone-800 dark:text-stone-200 border-stone-300 dark:border-stone-700 hover:border-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800'
                                      }\`}
                                    >
                                      <span>{chip.label}</span>
                                      {isYes ? <Zap className="w-3.5 h-3.5 opacity-90 shrink-0" /> : <Clock className="w-3.5 h-3.5 opacity-80 shrink-0" />}
                                    </button>
                                  );
                                }

                                `.replace(/\n/g, '\r\n');

  code = code.replace(
    /if \(msg\.decisionTree\?\.step === 'ai_model_switch'\) \{/,
    activationRenderCode + "if (msg.decisionTree?.step === 'ai_model_switch') {"
  );
}

fs.writeFileSync(widgetPath, code, 'utf8');
console.log('Successfully updated AIChatWidget.jsx');
