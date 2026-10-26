const fs = require('fs');
const path = require('path');

const targetPath = path.resolve('src/components/AIChatWidget.jsx');
let code = fs.readFileSync(targetPath, 'utf8');

// 1. Remove Active AI Mode Banner / Status Bar
const bannerStart = code.indexOf('{/* Active AI Mode Banner / Status Bar */}');
if (bannerStart === -1) {
  console.error('Active AI Mode Banner not found!');
  process.exit(1);
}
const bannerEnd = code.indexOf('{/* Prominent Live Download Card & Real Progress Bar */}', bannerStart);
if (bannerEnd === -1) {
  console.error('Download card marker not found!');
  process.exit(1);
}
code = code.slice(0, bannerStart) + code.slice(bannerEnd);
console.log('1. Removed Active AI Mode Banner successfully.');

// 2. Exclude bare-minimum (SmolLM-135M) from user selection list in handleTriggerAIModelDecisionTree
const modelDecisionTreeStart = code.indexOf('const handleTriggerAIModelDecisionTree = () => {');
if (modelDecisionTreeStart === -1) {
  console.error('handleTriggerAIModelDecisionTree not found!');
  process.exit(1);
}
const modelDecisionTreeEnd = code.indexOf('const handleAiModelSwitchSelect = (chip) => {', modelDecisionTreeStart);
if (modelDecisionTreeEnd === -1) {
  console.error('handleAiModelSwitchSelect not found!');
  process.exit(1);
}

const newModelDecisionTree = `const handleTriggerAIModelDecisionTree = () => {
    if (soundEnabled && soundFX?.playTap) soundFX.playTap();

    const deviceProfile = localAiState?.deviceProfile;
    // Default to MEDIUM (Qwen-1.5B) or HIGH (Qwen-3B) for capable device
    let recommended = deviceProfile?.recommendedModel;
    if (!recommended || recommended.id === MODEL_CATALOG.BARE_MINIMUM.id) {
      recommended = MODEL_CATALOG.MEDIUM;
    }

    // Note: '🛡️ बेयर-मिनिमम बेस मॉडल' (SmolLM-135M) is excluded from user choice and reserved purely as internal baseline fallback.
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

    // ⚖️ बैलेंस्ड मिड मॉडल / बैलेंस्ड लाइट मॉडल: Add Balanced Light Model (Qwen-0.5B)
    if (recommended.id !== MODEL_CATALOG.LIGHT.id) {
      options.push({
        id: MODEL_CATALOG.LIGHT.id,
        modelId: MODEL_CATALOG.LIGHT.id,
        shortcut: MODEL_CATALOG.LIGHT.shortcut,
        label: \`⚖️ बैलेंस्ड लाइट मॉडल (\${MODEL_CATALOG.LIGHT.shortcut})\`,
        sublabel: \`\${MODEL_CATALOG.LIGHT.name} • ~\${MODEL_CATALOG.LIGHT.approxSizeMB}MB • तेज़ गति व संतुलित रिस्पॉन्स\`,
        isMid: true
      });
    } else {
      options.push({
        id: MODEL_CATALOG.MEDIUM.id,
        modelId: MODEL_CATALOG.MEDIUM.id,
        shortcut: MODEL_CATALOG.MEDIUM.shortcut,
        label: \`⚖️ बैलेंस्ड मीडियम मॉडल (\${MODEL_CATALOG.MEDIUM.shortcut})\`,
        sublabel: \`\${MODEL_CATALOG.MEDIUM.name} • ~\${MODEL_CATALOG.MEDIUM.approxSizeMB}MB • उच्च सटीकता\`,
        isMid: true
      });
    }

    // 🔌 AI ऑफ करें / Turn Off AI ([Portfolio-Engine])
    options.push({
      id: 'portfolio-engine',
      modelId: 'portfolio-engine',
      shortcut: '[Portfolio-Engine]',
      label: '🔌 AI ऑफ करें / Turn Off AI',
      sublabel: '100% ऑफलाइन डिटर्मिनिस्टिक नॉलेज इंजन [Portfolio-Engine] • 0MB',
      isTurnOff: true
    });

    const newMsg = {
      id: \`assistant-ai-model-trigger-\${Date.now()}\`,
      sender: 'assistant',
      text: "🤖 **Select AI Model / AI मॉडल चुनें**\\n\\nअपनी डिवाइस क्षमता और नेटवर्क स्पीड के अनुसार उपयुक्त AI मॉडल चुनें या AI को ऑफ करके 100% ऑफलाइन इंजन इस्तेमाल करें:",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      decisionTree: {
        step: 'ai_model_switch',
        title: "🤖 Select AI Model / AI मॉडल चुनें:",
        options
      }
    };
    setMessages((prev) => [...prev, newMsg]);
    if (soundEnabled && soundFX?.playFocusBeep) soundFX.playFocusBeep();
    setTimeout(scrollToBottom, 50);
  };

  /**
   * Handles user selection from Post-Download Model Activation Decision Tree
   */
  const handleModelActivationSelect = (chip) => {
    if (soundEnabled && soundFX?.playTap) soundFX.playTap();

    if (chip.action === 'activate') {
      localAIService.activateModel(chip.modelId);
      const userMsg = {
        id: \`user-activate-\${Date.now()}\`,
        sender: 'user',
        text: '⚡ हाँ, एक्टिवेट करो / Yes, Activate Now',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      const assistantMsg = {
        id: \`assistant-activate-ack-\${Date.now()}\`,
        sender: 'assistant',
        modelShortcut: chip.shortcut || '[On-Device AI]',
        text: \`✅ **AI मॉडल \${chip.shortcut || ''} सक्रिय कर दिया गया है!**\\n\\nअब आपके सभी प्रश्न सीधे आपके डिवाइस पर 100% प्राइवेट और ऑन-डिवाइस AI द्वारा प्रोसेस किए जाएंगे।\`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        chips: PROMPT_CHIPS
      };
      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      if (soundEnabled && soundFX?.playSuccess) soundFX.playSuccess();
      announce(\`AI model \${chip.shortcut} activated successfully.\`, 'polite');
    } else {
      const userMsg = {
        id: \`user-activate-later-\${Date.now()}\`,
        sender: 'user',
        text: '⏳ नहीं, अभी रहने दो / No, Later',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      const assistantMsg = {
        id: \`assistant-activate-later-ack-\${Date.now()}\`,
        sender: 'assistant',
        modelShortcut: localAiState?.activeModel?.shortcut || '[Portfolio-Engine]',
        text: "👌 **ठीक है!** मॉडल आपके ब्राउज़र कैशे में 100% सुरक्षित सहेजा गया है।\\n\\nवर्तमान मोड जारी है। आप जब चाहें AI मॉडल मेन्यू से इसे कभी भी एक्टिवेट कर सकते हैं!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        chips: PROMPT_CHIPS
      };
      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      if (soundEnabled && soundFX?.playTap) soundFX.playTap();
      announce('Model remains saved in cache. Current mode continued.', 'polite');
    }
    setTimeout(scrollToBottom, 50);
  };

  `;

code = code.slice(0, modelDecisionTreeStart) + newModelDecisionTree + code.slice(modelDecisionTreeEnd);
console.log('2. Updated handleTriggerAIModelDecisionTree & added handleModelActivationSelect.');

// 3. Add lastPostDownloadRef & post-download decision tree hook
const downgradeHookStr = "// Subtle in-chat notice when local AI auto-downgrades to preserve speed and smoothness";
const downgradeHookIdx = code.indexOf(downgradeHookStr);
if (downgradeHookIdx === -1) {
  console.error('Downgrade hook marker not found!');
  process.exit(1);
}

const postDownloadHook = `const lastPostDownloadRef = useRef(null);

  // Post-download activation decision tree prompt when user-selected model finishes downloading
  useEffect(() => {
    if (localAiState?.lastNotification?.type === 'download_complete') {
      const notif = localAiState.lastNotification;
      const modelId = notif.modelId || notif.model?.id;
      if (lastPostDownloadRef.current !== modelId) {
        lastPostDownloadRef.current = modelId;
        const modelName = notif.shortcut || notif.model?.shortcut || notif.model?.name || 'AI Model';

        const activationDecisionMsg = {
          id: \`assistant-post-download-\${Date.now()}\`,
          sender: 'assistant',
          modelShortcut: notif.shortcut || '[Portfolio-Engine]',
          text: \`🎉 **AI मॉडल \${modelName} सफलतापूर्वक डाउनलोड हो गया है!**\\n\\nयह आपके ब्राउज़र कैशे में 100% सुरक्षित और तैयार है। क्या आप इसे अभी एक्टिवेट करना चाहते हैं?\`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          decisionTree: {
            step: 'model_activation',
            modelId: modelId,
            modelShortcut: modelName,
            title: \`क्या आप \${modelName} को अभी एक्टिवेट करना चाहते हैं?\`,
            options: [
              {
                id: 'activate_yes',
                action: 'activate',
                modelId: modelId,
                shortcut: modelName,
                label: '⚡ हाँ, एक्टिवेट करो / Yes, Activate Now',
                sublabel: 'तुरंत ऑन-डिवाइस AI सक्रिय करें और सीधे अपने डिवाइस पर प्रोसेस करें'
              },
              {
                id: 'activate_no',
                action: 'later',
                modelId: modelId,
                shortcut: modelName,
                label: '⏳ नहीं, अभी रहने दो / No, Later',
                sublabel: 'मॉडल ब्राउज़र कैशे में सुरक्षित रहेगा, वर्तमान मोड जारी रहेगा'
              }
            ]
          }
        };

        setMessages((prev) => [...prev, activationDecisionMsg]);
        if (soundEnabled && soundFX?.playSuccess) soundFX.playSuccess();
        setTimeout(scrollToBottom, 50);
      }
    }
  }, [localAiState?.lastNotification, scrollToBottom, soundEnabled, soundFX]);

  `;

code = code.slice(0, downgradeHookIdx) + postDownloadHook + code.slice(downgradeHookIdx);
console.log('3. Added post-download activation decision tree hook.');

// 4. Render decision tree buttons for step === 'model_activation'
const renderStepSwitchStr = "if (msg.decisionTree?.step === 'ai_model_switch') {";
const renderStepSwitchIdx = code.indexOf(renderStepSwitchStr);
if (renderStepSwitchIdx === -1) {
  console.error('renderStepSwitchStr not found!');
  process.exit(1);
}

const modelActivationRender = `if (msg.decisionTree?.step === 'model_activation') {
                                  return (
                                    <button
                                      key={chip.id}
                                      type="button"
                                      onClick={() => handleModelActivationSelect(chip)}
                                      className="w-full p-2.5 rounded-xl text-left transition-all cursor-pointer border flex flex-col gap-1 shadow-2xs bg-white dark:bg-[#1E162B] text-stone-800 dark:text-stone-200 border-stone-300 dark:border-stone-700 hover:border-emerald-500/80 hover:bg-stone-50 dark:hover:bg-stone-850"
                                    >
                                      <span className="text-[11px] font-semibold flex items-center gap-1.5 text-stone-900 dark:text-stone-100">
                                        {chip.label}
                                      </span>
                                      {chip.sublabel && (
                                        <p className="text-[10px] text-stone-500 dark:text-stone-400 font-mono leading-relaxed">
                                          {chip.sublabel}
                                        </p>
                                      )}
                                    </button>
                                  );
                                }

                                `;

code = code.slice(0, renderStepSwitchIdx) + modelActivationRender + code.slice(renderStepSwitchIdx);
console.log('4. Added model_activation decision tree renderer.');

// 5. Update handleSendMessage with Hybrid Smart Inference
const handleSendStartStr = "  // Handle message submission";
const handleSendStartIdx = code.indexOf(handleSendStartStr);
if (handleSendStartIdx === -1) {
  console.error('handleSendMessage start not found!');
  process.exit(1);
}

const handleSendEndStr = "  // Handle keyboard submission, slash autocomplete navigation & Escape minimization";
const handleSendEndIdx = code.indexOf(handleSendEndStr, handleSendStartIdx);
if (handleSendEndIdx === -1) {
  console.error('handleSendMessage end not found!');
  process.exit(1);
}

const newHandleSendMessage = `  // Handle message submission
  const handleSendMessage = (textToSend) => {
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

    // Process message with natural delay and hybrid inference
    typingTimeoutRef.current = setTimeout(async () => {
      try {
        let response = null;
        let botReplyText = '';
        let botChips = null;
        let botActions = null;
        let botDecisionTree = null;
        let isFallbackQuery = false;

        try {
          if (typeof queryAssistant === 'function') {
            response = queryAssistant(trimmed, { role: activeRole, audience });
            if (response) {
              botReplyText = response.text || '';
              botChips = response.chips || null;
              botActions = response.actions || null;
              botDecisionTree = response.decisionTree || null;
              isFallbackQuery = Boolean(response.isFallback || response.intent === 'fallback');
            }
          }
        } catch (err) {
          console.warn('queryAssistant exception:', err);
        }

        // Active model shortcut: reflects active local model or offline engine
        const isOnDeviceReady = (localAiState?.status === 'ready' || localAiState?.status === 'generating') && localAiState?.activeModel && localAiState?.isAiEnabled !== false;
        const activeShortcut = isOnDeviceReady ? localAiState.activeModel.shortcut : '[Portfolio-Engine]';

        // Hybrid Smart Inference:
        // 1. If portfolio knowledge matched (!isFallbackQuery && botReplyText): Knowledge engine answers with active model badge.
        // 2. If unmatched / general query (isFallbackQuery || !botReplyText) and On-Device AI is active:
        //    call localAIService.generateText(query) to obtain response from on-device model!
        if (isOnDeviceReady && (isFallbackQuery || !botReplyText)) {
          try {
            const systemPrompt = "You are Atul's AI Assistant for Atul Verma's portfolio. Provide helpful, accurate, concise answers.";
            const genResult = await localAIService.generateText({
              prompt: trimmed,
              systemPrompt,
              maxTokens: 120,
              temperature: 0.7
            });

            if (genResult && genResult.text && genResult.text.trim()) {
              botReplyText = genResult.text.trim();
              botChips = botChips || PROMPT_CHIPS;
            }
          } catch (genErr) {
            console.warn('[AIChatWidget] On-Device AI generateText fallback:', genErr);
          }
        }

        if (!botReplyText) {
          botReplyText = generateBotReply(trimmed);
          botChips = PROMPT_CHIPS;
        }

        const assistantMessage = {
          id: (response && response.id) || \`assistant-\${Date.now()}\`,
          sender: 'assistant',
          modelShortcut: activeShortcut,
          text: (response && response.text && !isFallbackQuery) ? response.text : botReplyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          chips: (response && response.chips) || botChips || PROMPT_CHIPS,
          actions: (response && response.actions) || botActions || [],
          decisionTree: (response && response.decisionTree) || botDecisionTree || null
        };

        setMessages((prev) => [...prev, assistantMessage]);
        const cleanForA11y = (str) =>
          typeof str === 'string'
            ? str.replace(/[*#_~•\`]/g, ' ').replace(/\\s+/g, ' ').trim()
            : '';
        setLiveAnnouncement(cleanForA11y(botReplyText));
        announce(botReplyText, 'polite');

        if (soundEnabled && soundFX?.playFocusBeep) {
          soundFX.playFocusBeep();
        }
      } finally {
        setIsTyping(false);
      }
    }, 350);
  };

  `;

code = code.slice(0, handleSendStartIdx) + newHandleSendMessage + code.slice(handleSendEndIdx);
console.log('5. Updated handleSendMessage with Hybrid Smart Inference.');

fs.writeFileSync(targetPath, code, 'utf8');
console.log('All changes written to AIChatWidget.jsx successfully!');
