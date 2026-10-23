import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const panelPath = path.join(rootDir, 'src/components/ControlCenterPanel.jsx');

let src = fs.readFileSync(panelPath, 'utf8');

const markerStart = '{/* 3. The 5 Detailed Single-Accordion Sections */}';
const markerEnd = '{/* 4. 1-Click Reset 3D Controls to Default */}';

const startIndex = src.indexOf(markerStart);
const endIndex = src.indexOf(markerEnd);

if (startIndex === -1 || endIndex === -1) {
  console.error('Markers not found! startIndex:', startIndex, 'endIndex:', endIndex);
  process.exit(1);
}

const originalAccordionBlock = src.slice(startIndex, endIndex);

// Helper to extract a section by title comments
function extractSection(startComment, endComment) {
  const s = originalAccordionBlock.indexOf(startComment);
  if (s === -1) throw new Error('Start comment not found: ' + startComment);
  let e = originalAccordionBlock.length;
  if (endComment) {
    e = originalAccordionBlock.indexOf(endComment);
    if (e === -1) throw new Error('End comment not found: ' + endComment);
  }
  let sectionContent = originalAccordionBlock.slice(s, e).trim();
  // If ends with closing </div> of container, remove the outermost container closing if needed
  return sectionContent;
}

const elementsRaw = extractSection(
  '{/* ACCORDION SECTION 1: ELEMENT 3D CONVERSION TOGGLES (10 ELEMENTS)         */}',
  '{/* ACCORDION SECTION 2: LIGHTING & SHADOWS                                   */}'
);

const lightingRaw = extractSection(
  '{/* ACCORDION SECTION 2: LIGHTING & SHADOWS                                   */}',
  '{/* ACCORDION SECTION 3: CAMERA & TILT PHYSICS                                */}'
);

const cameraRaw = extractSection(
  '{/* ACCORDION SECTION 3: CAMERA & TILT PHYSICS                                */}',
  '{/* ACCORDION SECTION 4: MATERIALS & SHADING                                  */}'
);

const materialsRaw = extractSection(
  '{/* ACCORDION SECTION 4: MATERIALS & SHADING                                  */}',
  '{/* ACCORDION SECTION 5: INTERACTION & PHYSICS                                */}'
);

// For physics, it goes up to the end of the accordion block minus the closing </div> of container
let physicsRaw = extractSection(
  '{/* ACCORDION SECTION 5: INTERACTION & PHYSICS                                */}',
  null
);
// Remove trailing </div> that closes <div className="flex flex-col gap-4">
physicsRaw = physicsRaw.replace(/\s*<\/div>\s*$/, '');

// Clean any accidental trailing separator comments
function cleanSection(raw) {
  return raw.replace(/\{\/\* =+\s*\*\/\}[\s\n]*$/, '').trim();
}

const cleanedElements = cleanSection(elementsRaw);
const cleanedMaterials = cleanSection(materialsRaw);
const cleanedLighting = cleanSection(lightingRaw);
const cleanedCamera = cleanSection(cameraRaw);
const cleanedPhysics = cleanSection(physicsRaw);

const clusterFilterBar = `
          {/* Top Cluster Filter Bar */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-stone-100/80 dark:bg-[#150F21]/80 border border-stone-200/80 dark:border-stone-800 backdrop-blur-md overflow-x-auto">
            {THREED_CLUSTERS.map((cluster) => {
              const isActive = (clusterFilter || 'all') === cluster.id;
              return (
                <button
                  key={cluster.id}
                  type="button"
                  onClick={() => {
                    set3DClusterFilter(cluster.id);
                    if (soundEnabled) soundFX.playHapticClick();
                  }}
                  className={\`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer \${
                    isActive
                      ? 'bg-white dark:bg-[#251B3D] text-[#18181B] dark:text-white shadow-xs border border-stone-200 dark:border-stone-700'
                      : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
                  }\`}
                >
                  <span>{cluster.label}</span>
                </button>
              );
            })}
          </div>
`;

const sectionExploded = `
            {/* ========================================================================= */}
            {/* ACCORDION SECTION 6: EXPLODED CAD & BLUEPRINT VIEW                        */}
            {/* ========================================================================= */}
            {isSectionVisible('exploded') && (
              <div className="rounded-2xl border border-[#ECE7DF] dark:border-[#2D2340] bg-white/70 dark:bg-[#181226]/70 backdrop-blur-md overflow-hidden shadow-xs transition-all">
                <button
                  type="button"
                  onClick={() => toggleAccordionSection('exploded')}
                  aria-expanded={expandedAccordion === 'exploded'}
                  className="w-full flex items-center justify-between p-4 sm:p-5 bg-white/85 dark:bg-[#1D162E]/85 hover:bg-stone-50 dark:hover:bg-[#251B3D] transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-cyan-500/15 text-cyan-500 flex items-center justify-center font-bold text-sm">
                      <Split className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-sm sm:text-base font-bold text-[#18181B] dark:text-white">
                        Exploded CAD &amp; Blueprint View
                      </h5>
                      <p className="text-xs text-stone-500 dark:text-stone-400">
                        Multi-layer strata separation, schematic blueprint wireframes &amp; depth staging
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full border bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30">
                      {exploded.enabled ? \`Exploded +\${exploded.separationDistance}px\` : 'Compact Assembled'}
                    </span>
                    {expandedAccordion === 'exploded' ? (
                      <ChevronUp className="w-5 h-5 text-stone-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-stone-400" />
                    )}
                  </div>
                </button>

                {expandedAccordion === 'exploded' && (
                  <div className="p-4 sm:p-5 border-t border-[#ECE7DF] dark:border-[#2D2340] flex flex-col gap-6 animate-fadeIn">
                    {/* Exploded Mode Main Toggle */}
                    <div className="p-3.5 rounded-xl border border-stone-200/80 dark:border-stone-800 bg-white/40 dark:bg-stone-900/40 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-[#18181B] dark:text-white flex items-center gap-1.5">
                          <Split className="w-4 h-4 text-cyan-500" />
                          <span>Exploded Layer Separation</span>
                        </div>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                          Unfolds UI elements outward along the Z-axis to reveal underlying spatial architecture
                        </p>
                      </div>

                      <button
                        type="button"
                        role="switch"
                        aria-checked={exploded.enabled}
                        aria-label="Toggle Exploded Layer Separation"
                        onClick={() => {
                          set3DExploded({ enabled: !exploded.enabled });
                          if (soundEnabled) soundFX.playHapticClick();
                        }}
                        className={\`w-11 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500/40 shrink-0 \${
                          exploded.enabled ? 'bg-cyan-500' : 'bg-stone-300 dark:bg-stone-700'
                        }\`}
                      >
                        <span
                          className={\`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 \${
                            exploded.enabled ? 'translate-x-5' : 'translate-x-0.5'
                          }\`}
                        />
                      </button>
                    </div>

                    {/* Blueprint Mode Toggle */}
                    <div className="p-3.5 rounded-xl border border-stone-200/80 dark:border-stone-800 bg-white/40 dark:bg-stone-900/40 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-[#18181B] dark:text-white flex items-center gap-1.5">
                          <Grid className="w-4 h-4 text-cyan-500" />
                          <span>Blueprint CAD Wireframe Mode</span>
                        </div>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                          Renders neon wireframe drafting grids, isometric dimensions &amp; technical outlines
                        </p>
                      </div>

                      <button
                        type="button"
                        role="switch"
                        aria-checked={exploded.blueprintMode}
                        aria-label="Toggle Blueprint CAD Wireframe Mode"
                        onClick={() => {
                          set3DExploded({ blueprintMode: !exploded.blueprintMode });
                          if (soundEnabled) soundFX.playLaserFocus();
                        }}
                        className={\`w-11 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500/40 shrink-0 \${
                          exploded.blueprintMode ? 'bg-cyan-500' : 'bg-stone-300 dark:bg-stone-700'
                        }\`}
                      >
                        <span
                          className={\`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 \${
                            exploded.blueprintMode ? 'translate-x-5' : 'translate-x-0.5'
                          }\`}
                        />
                      </button>
                    </div>

                    {/* Sliders: Separation Distance & Layer Stagger */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-200/60 dark:border-stone-800/80">
                      <div className="p-3.5 rounded-xl border border-stone-200/80 dark:border-stone-800 bg-white/40 dark:bg-stone-900/40 flex flex-col justify-between gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#18181B] dark:text-white">
                            Separation Distance
                          </span>
                          <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">
                            {exploded.separationDistance}px
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="120"
                          step="5"
                          value={exploded.separationDistance}
                          onChange={(e) => set3DExploded({ separationDistance: parseInt(e.target.value, 10) })}
                          className="w-full accent-cyan-500 cursor-pointer"
                          aria-label="3D Exploded Separation Distance"
                        />
                        <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                          <span>0px (Flushed)</span>
                          <span>120px (Maximum Explosion)</span>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl border border-stone-200/80 dark:border-stone-800 bg-white/40 dark:bg-stone-900/40 flex flex-col justify-between gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#18181B] dark:text-white">
                            Strata Stagger Offset
                          </span>
                          <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">
                            {exploded.layerStagger}px
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="50"
                          step="5"
                          value={exploded.layerStagger}
                          onChange={(e) => set3DExploded({ layerStagger: parseInt(e.target.value, 10) })}
                          className="w-full accent-cyan-500 cursor-pointer"
                          aria-label="3D Exploded Layer Stagger"
                        />
                        <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                          <span>0px (Uniform)</span>
                          <span>50px (Staggered Cascade)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
`;

const sectionEnvironment = `
            {/* ========================================================================= */}
            {/* ACCORDION SECTION 7: ENVIRONMENT & VOLUMETRIC FOG                         */}
            {/* ========================================================================= */}
            {isSectionVisible('environment') && (
              <div className="rounded-2xl border border-[#ECE7DF] dark:border-[#2D2340] bg-white/70 dark:bg-[#181226]/70 backdrop-blur-md overflow-hidden shadow-xs transition-all">
                <button
                  type="button"
                  onClick={() => toggleAccordionSection('environment')}
                  aria-expanded={expandedAccordion === 'environment'}
                  className="w-full flex items-center justify-between p-4 sm:p-5 bg-white/85 dark:bg-[#1D162E]/85 hover:bg-stone-50 dark:hover:bg-[#251B3D] transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/15 text-indigo-500 flex items-center justify-center font-bold text-sm">
                      <CloudFog className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-sm sm:text-base font-bold text-[#18181B] dark:text-white">
                        Environment &amp; Volumetric Fog
                      </h5>
                      <p className="text-xs text-stone-500 dark:text-stone-400">
                        Skybox atmosphere, stardust particles, depth of field &amp; volumetric mist
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full border bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30">
                      {environment.skybox} • {environment.fogDensity}% Fog
                    </span>
                    {expandedAccordion === 'environment' ? (
                      <ChevronUp className="w-5 h-5 text-stone-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-stone-400" />
                    )}
                  </div>
                </button>

                {expandedAccordion === 'environment' && (
                  <div className="p-4 sm:p-5 border-t border-[#ECE7DF] dark:border-[#2D2340] flex flex-col gap-6 animate-fadeIn">
                    {/* Skybox Selection */}
                    <div className="flex flex-col gap-3">
                      <span className="text-xs font-bold text-[#18181B] dark:text-white flex items-center gap-1.5">
                        <Globe className="w-4 h-4 text-indigo-500" />
                        <span>3D Atmosphere &amp; Skybox</span>
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {SKYBOX_PRESETS.map((sb) => {
                          const isSelected = environment.skybox === sb.id;
                          return (
                            <button
                              key={sb.id}
                              type="button"
                              onClick={() => {
                                set3DEnvironment({ skybox: sb.id });
                                if (soundEnabled) soundFX.playLaserFocus();
                              }}
                              className={\`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer \${
                                isSelected
                                  ? 'bg-indigo-500/10 border-indigo-500 ring-2 ring-indigo-500/30 shadow-xs text-[#18181B] dark:text-white'
                                  : 'bg-white/40 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-300'
                              }\`}
                            >
                              <div className="flex items-center justify-between w-full mb-1">
                                <span className="text-xs font-bold">{sb.name}</span>
                                {isSelected && <Check className="w-3.5 h-3.5 text-indigo-500" />}
                              </div>
                              <span className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 leading-snug">
                                {sb.desc}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Stardust Particle Simulation Toggle */}
                    <div className="p-3.5 rounded-xl border border-stone-200/80 dark:border-stone-800 bg-white/40 dark:bg-stone-900/40 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-[#18181B] dark:text-white flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-indigo-500" />
                          <span>Stardust Particle Field</span>
                        </div>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                          Floating luminescent particles reacting with subtle parallax floatation
                        </p>
                      </div>

                      <button
                        type="button"
                        role="switch"
                        aria-checked={environment.stardustParticles}
                        aria-label="Toggle Stardust Particle Field"
                        onClick={() => {
                          set3DEnvironment({ stardustParticles: !environment.stardustParticles });
                          if (soundEnabled) soundFX.playHapticClick();
                        }}
                        className={\`w-11 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/40 shrink-0 \${
                          environment.stardustParticles ? 'bg-indigo-500' : 'bg-stone-300 dark:bg-stone-700'
                        }\`}
                      >
                        <span
                          className={\`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 \${
                            environment.stardustParticles ? 'translate-x-5' : 'translate-x-0.5'
                          }\`}
                        />
                      </button>
                    </div>

                    {/* Sliders: Volumetric Fog & Depth of Field */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-200/60 dark:border-stone-800/80">
                      <div className="p-3.5 rounded-xl border border-stone-200/80 dark:border-stone-800 bg-white/40 dark:bg-stone-900/40 flex flex-col justify-between gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#18181B] dark:text-white">
                            Volumetric Fog Density
                          </span>
                          <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                            {environment.fogDensity}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="5"
                          value={environment.fogDensity}
                          onChange={(e) => set3DEnvironment({ fogDensity: parseInt(e.target.value, 10) })}
                          className="w-full accent-indigo-500 cursor-pointer"
                          aria-label="3D Volumetric Fog Density"
                        />
                        <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                          <span>0% (Crystal Clear)</span>
                          <span>100% (Dense Nebula)</span>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl border border-stone-200/80 dark:border-stone-800 bg-white/40 dark:bg-stone-900/40 flex flex-col justify-between gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#18181B] dark:text-white">
                            Depth-of-Field (DoF) Blur
                          </span>
                          <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                            {environment.depthOfFieldBlur}px
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="10"
                          step="1"
                          value={environment.depthOfFieldBlur}
                          onChange={(e) => set3DEnvironment({ depthOfFieldBlur: parseInt(e.target.value, 10) })}
                          className="w-full accent-indigo-500 cursor-pointer"
                          aria-label="3D Depth of Field Blur"
                        />
                        <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                          <span>0px (Infinite Focus)</span>
                          <span>10px (Cinematic Bokeh)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
`;

const sectionSpatialAudio = `
            {/* ========================================================================= */}
            {/* ACCORDION SECTION 8: 3D SPATIAL AUDIO & REVERB                            */}
            {/* ========================================================================= */}
            {isSectionVisible('spatialAudio') && (
              <div className="rounded-2xl border border-[#ECE7DF] dark:border-[#2D2340] bg-white/70 dark:bg-[#181226]/70 backdrop-blur-md overflow-hidden shadow-xs transition-all">
                <button
                  type="button"
                  onClick={() => toggleAccordionSection('spatialAudio')}
                  aria-expanded={expandedAccordion === 'spatialAudio'}
                  className="w-full flex items-center justify-between p-4 sm:p-5 bg-white/85 dark:bg-[#1D162E]/85 hover:bg-stone-50 dark:hover:bg-[#251B3D] transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center font-bold text-sm">
                      <Headphones className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-sm sm:text-base font-bold text-[#18181B] dark:text-white">
                        3D Spatial Audio &amp; Reverb
                      </h5>
                      <p className="text-xs text-stone-500 dark:text-stone-400">
                        Binaural HRTF panning, acoustic room simulation &amp; material impact resonance
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full border bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                      {spatialAudio.roomSize} • {Math.round(spatialAudio.reverbIntensity * 100)}% Reverb
                    </span>
                    {expandedAccordion === 'spatialAudio' ? (
                      <ChevronUp className="w-5 h-5 text-stone-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-stone-400" />
                    )}
                  </div>
                </button>

                {expandedAccordion === 'spatialAudio' && (
                  <div className="p-4 sm:p-5 border-t border-[#ECE7DF] dark:border-[#2D2340] flex flex-col gap-6 animate-fadeIn">
                    {/* Binaural Panning Toggle */}
                    <div className="p-3.5 rounded-xl border border-stone-200/80 dark:border-stone-800 bg-white/40 dark:bg-stone-900/40 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-[#18181B] dark:text-white flex items-center gap-1.5">
                          <Radio className="w-4 h-4 text-emerald-500" />
                          <span>Binaural HRTF Spatial Panning</span>
                        </div>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                          Pans UI click sound effects dynamically in 3D space based on mouse cursor position
                        </p>
                      </div>

                      <button
                        type="button"
                        role="switch"
                        aria-checked={spatialAudio.binauralPanning}
                        aria-label="Toggle Binaural HRTF Spatial Panning"
                        onClick={() => {
                          set3DSpatialAudio({ binauralPanning: !spatialAudio.binauralPanning });
                          if (soundEnabled) soundFX.playHapticClick();
                        }}
                        className={\`w-11 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/40 shrink-0 \${
                          spatialAudio.binauralPanning ? 'bg-emerald-500' : 'bg-stone-300 dark:bg-stone-700'
                        }\`}
                      >
                        <span
                          className={\`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 \${
                            spatialAudio.binauralPanning ? 'translate-x-5' : 'translate-x-0.5'
                          }\`}
                        />
                      </button>
                    </div>

                    {/* Room Size Presets */}
                    <div className="flex flex-col gap-3">
                      <span className="text-xs font-bold text-[#18181B] dark:text-white flex items-center gap-1.5">
                        <Headphones className="w-4 h-4 text-emerald-500" />
                        <span>Acoustic Room Simulation</span>
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {ROOM_SIZE_PRESETS.map((rp) => {
                          const isSelected = spatialAudio.roomSize === rp.id;
                          return (
                            <button
                              key={rp.id}
                              type="button"
                              onClick={() => {
                                set3DSpatialAudio({ roomSize: rp.id });
                                if (soundEnabled) soundFX.playLaserFocus();
                              }}
                              className={\`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer \${
                                isSelected
                                  ? 'bg-emerald-500/10 border-emerald-500 ring-2 ring-emerald-500/30 shadow-xs text-[#18181B] dark:text-white'
                                  : 'bg-white/40 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-300'
                              }\`}
                            >
                              <div className="flex items-center justify-between w-full mb-1">
                                <span className="text-xs font-bold">{rp.name}</span>
                                {isSelected && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                              </div>
                              <span className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 leading-snug">
                                {rp.desc}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Reverb Intensity Slider */}
                    <div className="p-3.5 rounded-xl border border-stone-200/80 dark:border-stone-800 bg-white/40 dark:bg-stone-900/40 flex flex-col justify-between gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#18181B] dark:text-white">
                          Acoustic Reverb Tail
                        </span>
                        <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {Math.round(spatialAudio.reverbIntensity * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={spatialAudio.reverbIntensity}
                        onChange={(e) => set3DSpatialAudio({ reverbIntensity: parseFloat(e.target.value) })}
                        className="w-full accent-emerald-500 cursor-pointer"
                        aria-label="3D Acoustic Reverb Tail"
                      />
                      <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                        <span>0% (Dry Direct Sound)</span>
                        <span>100% (Lush Wet Diffusion)</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
`;

const sectionPerformance = `
            {/* ========================================================================= */}
            {/* ACCORDION SECTION 9: PERFORMANCE & GPU ACCELERATION                       */}
            {/* ========================================================================= */}
            {isSectionVisible('performance') && (
              <div className="rounded-2xl border border-[#ECE7DF] dark:border-[#2D2340] bg-white/70 dark:bg-[#181226]/70 backdrop-blur-md overflow-hidden shadow-xs transition-all">
                <button
                  type="button"
                  onClick={() => toggleAccordionSection('performance')}
                  aria-expanded={expandedAccordion === 'performance'}
                  className="w-full flex items-center justify-between p-4 sm:p-5 bg-white/85 dark:bg-[#1D162E]/85 hover:bg-stone-50 dark:hover:bg-[#251B3D] transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-orange-500/15 text-orange-500 flex items-center justify-center font-bold text-sm">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-sm sm:text-base font-bold text-[#18181B] dark:text-white">
                        Performance &amp; GPU Acceleration
                      </h5>
                      <p className="text-xs text-stone-500 dark:text-stone-400">
                        Frame rate limits, hardware transform3d pipelines &amp; idle power throttling
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full border bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30">
                      {performanceConfig.fpsTarget} FPS • {performanceConfig.gpuAcceleration}
                    </span>
                    {expandedAccordion === 'performance' ? (
                      <ChevronUp className="w-5 h-5 text-stone-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-stone-400" />
                    )}
                  </div>
                </button>

                {expandedAccordion === 'performance' && (
                  <div className="p-4 sm:p-5 border-t border-[#ECE7DF] dark:border-[#2D2340] flex flex-col gap-6 animate-fadeIn">
                    {/* Target FPS Presets */}
                    <div className="flex flex-col gap-3">
                      <span className="text-xs font-bold text-[#18181B] dark:text-white flex items-center gap-1.5">
                        <Cpu className="w-4 h-4 text-orange-500" />
                        <span>Rendering Frame Rate Target</span>
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {FPS_PRESETS.map((fp) => {
                          const isSelected = performanceConfig.fpsTarget === fp.id;
                          return (
                            <button
                              key={fp.id}
                              type="button"
                              onClick={() => {
                                set3DPerformance({ fpsTarget: fp.id });
                                if (soundEnabled) soundFX.playLaserFocus();
                              }}
                              className={\`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer \${
                                isSelected
                                  ? 'bg-orange-500/10 border-orange-500 ring-2 ring-orange-500/30 shadow-xs text-[#18181B] dark:text-white'
                                  : 'bg-white/40 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-300'
                              }\`}
                            >
                              <div className="flex items-center justify-between w-full mb-1">
                                <span className="text-xs font-bold">{fp.name}</span>
                                {isSelected && <Check className="w-3.5 h-3.5 text-orange-500" />}
                              </div>
                              <span className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 leading-snug">
                                {fp.desc}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Auto Throttle Idle & Battery Threshold Toggles */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-200/60 dark:border-stone-800/80">
                      <div className="p-3.5 rounded-xl border border-stone-200/80 dark:border-stone-800 bg-white/40 dark:bg-stone-900/40 flex items-center justify-between gap-3">
                        <div>
                          <div className="text-xs font-bold text-[#18181B] dark:text-white flex items-center gap-1.5">
                            <Gauge className="w-4 h-4 text-orange-500" />
                            <span>Idle Motion Throttling</span>
                          </div>
                          <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                            Pauses active 3D transforms when cursor is dormant for &gt;3s
                          </p>
                        </div>

                        <button
                          type="button"
                          role="switch"
                          aria-checked={performanceConfig.autoThrottleIdle}
                          aria-label="Toggle Idle Motion Throttling"
                          onClick={() => {
                            set3DPerformance({ autoThrottleIdle: !performanceConfig.autoThrottleIdle });
                            if (soundEnabled) soundFX.playHapticClick();
                          }}
                          className={\`w-11 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500/40 shrink-0 \${
                            performanceConfig.autoThrottleIdle ? 'bg-orange-500' : 'bg-stone-300 dark:bg-stone-700'
                          }\`}
                        >
                          <span
                            className={\`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 \${
                              performanceConfig.autoThrottleIdle ? 'translate-x-5' : 'translate-x-0.5'
                            }\`}
                          />
                        </button>
                      </div>

                      <div className="p-3.5 rounded-xl border border-stone-200/80 dark:border-stone-800 bg-white/40 dark:bg-stone-900/40 flex items-center justify-between gap-3">
                        <div>
                          <div className="text-xs font-bold text-[#18181B] dark:text-white flex items-center gap-1.5">
                            <Battery className="w-4 h-4 text-orange-500" />
                            <span>Low Power Mode Detection</span>
                          </div>
                          <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                            Automatically drops to 30 FPS when OS enters battery saver
                          </p>
                        </div>

                        <button
                          type="button"
                          role="switch"
                          aria-checked={performanceConfig.lowPowerThreshold}
                          aria-label="Toggle Low Power Mode Detection"
                          onClick={() => {
                            set3DPerformance({ lowPowerThreshold: !performanceConfig.lowPowerThreshold });
                            if (soundEnabled) soundFX.playHapticClick();
                          }}
                          className={\`w-11 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500/40 shrink-0 \${
                            performanceConfig.lowPowerThreshold ? 'bg-orange-500' : 'bg-stone-300 dark:bg-stone-700'
                          }\`}
                        >
                          <span
                            className={\`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 \${
                              performanceConfig.lowPowerThreshold ? 'translate-x-5' : 'translate-x-0.5'
                            }\`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
`;

const toolkitCard = `
          {/* 3D Profile, Export & Developer Toolkit Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#181226]/90 border border-[#E7E2D8] dark:border-[#2D2340] shadow-xs flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-bold text-[#18181B] dark:text-white flex items-center gap-2">
                  <Code className="w-4 h-4 text-[#FF4D6D]" />
                  <span>3D Profile, Export &amp; Developer Toolkit</span>
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Export or restore full JSON profiles, copy CSS custom properties &amp; inspect real-time spatial tokens
                </p>
              </div>

              {toolkitStatus && (
                <div className={\`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border \${
                  toolkitStatus.type === 'success'
                    ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                    : 'bg-rose-500/10 text-rose-600 border-rose-500/30'
                }\`}>
                  <span>{toolkitStatus.message}</span>
                </div>
              )}
            </div>

            {/* Hidden file input for import */}
            <input
              ref={jsonFileInputRef}
              type="file"
              accept=".json"
              onChange={handleJsonFileChange}
              className="hidden"
              aria-label="Upload 3D JSON Configuration"
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={handleExportJson}
                className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-97"
              >
                <Download className="w-4 h-4 text-[#FF4D6D]" />
                <span>Export 3D Profile (.json)</span>
              </button>

              <button
                type="button"
                onClick={handleImportJsonClick}
                className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-97"
              >
                <Upload className="w-4 h-4 text-cyan-500" />
                <span>Import Profile (.json)</span>
              </button>

              <button
                type="button"
                onClick={handleCopyCssVariables}
                className={\`flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-97 \${
                  copiedCss
                    ? 'bg-emerald-500 text-white'
                    : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200'
                }\`}
              >
                {copiedCss ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied CSS Variables!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-amber-500" />
                    <span>Copy CSS Custom Properties</span>
                  </>
                )}
              </button>
            </div>
          </div>
`;

// Assemble the replacement
const newAccordionBlock = `
${clusterFilterBar.trim()}

          {/* 4. The 9 Single-Accordion Sections Across 3 Clusters */}
          <div className="flex flex-col gap-4">
            {/* Cluster 1: Design & Materials */}
            {isSectionVisible('elements') && (
${cleanedElements}
            )}

            {isSectionVisible('materials') && (
${cleanedMaterials}
            )}

            {isSectionVisible('lighting') && (
${cleanedLighting}
            )}

            {/* Cluster 2: Physics & CAD */}
            {isSectionVisible('camera') && (
${cleanedCamera}
            )}

            {isSectionVisible('physics') && (
${cleanedPhysics}
            )}

${sectionExploded.trim()}

            {/* Cluster 3: Environment & System */}
${sectionEnvironment.trim()}

${sectionSpatialAudio.trim()}

${sectionPerformance.trim()}
          </div>

${toolkitCard.trim()}
`;

const updatedSrc = src.slice(0, startIndex) + newAccordionBlock.trim() + '\n\n          ' + src.slice(endIndex);
fs.writeFileSync(panelPath, updatedSrc, 'utf8');
console.log('Successfully patched ControlCenterPanel.jsx with Next-Level 3D Suite!');
