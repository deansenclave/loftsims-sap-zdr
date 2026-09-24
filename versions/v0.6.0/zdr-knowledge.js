(function(){
const kb=window.LOFTSIMS_ZDR_KNOWLEDGE;
if(!kb)return;

const profiles={
  generic:{label:'Generic AI Technology',anchors:['A01','A02','A03','A04','A05','A06','A07','A08','A09','A10','A11','A12','A13','A14','A15'],extra:[]},
  model_api:{label:'Direct model/API',anchors:['A01','A02','A03','A04','A05','A06','A07','A09','A10','A12','A13','A14'],extra:['Is ZDR enabled for this exact organization, project, endpoint and model?','Does the request activate stored responses, files, caching, memory, batch processing or background execution?']},
  enterprise_app:{label:'Enterprise AI application',anchors:['A01','A02','A04','A05','A06','A07','A08','A09','A10','A11','A12','A13','A14','A15'],extra:['Does the consuming application retain prompts, responses, feedback, audit records or conversation history?','Is downstream-provider ZDR distinct from application-side retention?']},
  custom_rag:{label:'Custom AI/RAG application',anchors:['A01','A02','A03','A04','A05','A06','A07','A08','A09','A10','A11','A12','A13','A14','A15'],extra:['Are retrieved chunks, embeddings and vector records deleted with the request?','Can orchestration traces, queues or evaluation datasets contain customer content?']},
  agentic:{label:'Agentic AI system',anchors:['A01','A02','A03','A04','A05','A06','A07','A08','A09','A10','A11','A12','A13','A14','A15'],extra:['Do tool calls, agent memory, checkpoints or sandbox snapshots persist content?','Are write-back actions subject to human approval?']},
  governance:{label:'AI governance/control platform',anchors:['A04','A05','A06','A07','A08','A09','A10','A11','A12','A14','A15'],extra:['Does the governance platform copy inspected prompts or responses into its own logs?','What retention applies to evidence, monitoring and incident records?']}
};

let knowledgeState={profile:'generic',confirmed:false,system_type:'',provider:'',product:'',features:[],selected_source_id:'',matched_source_ids:[],questionnaire:[],generated_at:null};
const navHost=document.querySelector('.side nav');
const flavorNav=[...navHost.querySelectorAll('.nav')].find(x=>x.dataset.view==='flavor');
const knowledgeNav=document.createElement('button');
knowledgeNav.className='nav';knowledgeNav.dataset.view='knowledge';knowledgeNav.textContent='04 · Knowledge match';
flavorNav.after(knowledgeNav);
const labels={current:'05 · As-is input',assessment:'06 · Assessment',future:'07 · Future state',recommendation:'08 · Recommendation'};
Object.entries(labels).forEach(([id,label])=>{let n=navHost.querySelector(`[data-view="${id}"]`);if(n)n.textContent=label});

const view=document.createElement('div');view.className='view';view.id='knowledge';
view.innerHTML=`<div class="head"><div><span class="eyebrow">KNOWLEDGE GATE</span><h2>Source system and ZDR knowledge match</h2><p>Confirm the system class before LoftSims composes the source-aware questionnaire.</p></div><button class="btn" id="downloadKnowledge">Download knowledge artifacts</button></div>
<div class="grid"><article class="card"><h3>Preliminary classification</h3>
<label class="field">System profile<select id="knowledgeProfile">${Object.entries(profiles).map(([id,p])=>`<option value="${id}">${p.label}</option>`).join('')}</select></label>
<label class="field">Known ZDR source or product<select id="knowledgePreset"><option value="">Select from all ${kb.sources.length} captured sources</option>${kb.sources.map(s=>`<option value="${esc(s.id)}">${esc(s.organization)} — ${esc(s.product)} — ${esc(s.id)}</option>`).join('')}</select></label>
<label class="field">Source system / consuming product<input id="knowledgeSystem" placeholder="SAP Joule, Salesforce Agentforce, Microsoft Copilot, custom application…"></label>
<label class="field">Model or platform provider<input id="knowledgeProvider" placeholder="OpenAI, Anthropic, Google Cloud, AWS, Microsoft…"></label>
<label class="field">Exact product, service or feature<input id="knowledgeProduct" placeholder="Responses API, Bedrock, Einstein Trust Layer…"></label>
<label class="field">Features<input id="knowledgeFeatures" placeholder="Comma-separated: RAG, files, memory, agents, audit"></label>
<label class="check"><input id="knowledgeConfirmed" type="checkbox"> Human confirms this preliminary classification</label>
<div class="buttons"><button class="btn primary" id="matchKnowledge">Match sources and build questionnaire</button><button class="btn" id="clearKnowledge">Clear</button></div></article>
<article class="card"><h3>Selection result</h3><pre id="knowledgeResult" style="white-space:pre-wrap;color:var(--muted)">No classification confirmed.</pre></article></div>
<article class="card" style="margin-top:12px"><h3>Tailored questionnaire additions</h3><div id="knowledgeQuestions" class="sap-questions"><p class="empty">Confirm the system class to generate questions.</p></div></article>
<article class="card" style="margin-top:12px"><h3>Corpus sources</h3><p>${kb.sources.length} captured sources. Matched sources are highlighted after confirmation.</p><div id="knowledgeSources" style="display:grid;gap:8px"></div></article>
<div class="buttons"><button class="btn" id="knowledgeBack">← Back</button><button class="btn" id="knowledgeClearBottom">Clear</button><button class="btn primary" id="knowledgeContinue">Continue to As-is →</button></div>`;
document.getElementById('flavor').after(view);

function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function matchingSources(state){
  if(state.selected_source_id){const chosen=kb.sources.find(s=>s.id===state.selected_source_id);if(chosen){const related=kb.sources.filter(s=>s.organization===chosen.organization||s.product===chosen.product);return [...new Map([chosen,...related].map(s=>[s.id,s])).values()]}}
  const needles=[state.system_type,state.provider,state.product,...state.features].map(x=>String(x).trim().toLowerCase()).filter(x=>x.length>2);
  if(!needles.length)return [];
  return kb.sources.filter(s=>{const h=[s.organization,s.product,s.title,s.claim_scope,s.assessment_impact].join(' ').toLowerCase();return needles.some(n=>h.includes(n)||n.includes(String(s.organization).toLowerCase()))});
}
function buildQuestionnaire(state,matches){
  const p=profiles[state.profile]||profiles.generic;
  const base=p.anchors.map(id=>{const a=kb.anchors.find(x=>x.id===id);return{question_id:`${state.profile.toUpperCase()}-${id}`,anchor_id:id,factor:a.factor,question:`Provide installation-specific evidence for ${a.factor.replaceAll('_',' ')}.`,origin:'canonical_anchor'}});
  const extras=p.extra.map((q,i)=>({question_id:`${state.profile.toUpperCase()}-X${String(i+1).padStart(2,'0')}`,anchor_id:null,factor:'profile_extension',question:q,origin:'system_profile'}));
  const sourceQuestions=matches.flatMap(s=>Object.entries(s.anchor_vector).filter(([,v])=>v.coverage!=='not_covered').map(([id,v])=>({question_id:`SRC-${s.id}-${id}`,anchor_id:id,factor:v.factor,question:`Confirm whether ${s.organization} publication “${s.title}” applies to this exact installation and supply ${s.verification}.`,origin:'knowledge_source',source_id:s.id}))).slice(0,30);
  return [...base,...extras,...sourceQuestions];
}
function renderSources(){
  const selected=new Set(knowledgeState.matched_source_ids);
  document.getElementById('knowledgeSources').innerHTML=kb.sources.map(s=>`<label style="display:block;padding:10px;border:1px solid var(--line);border-radius:8px;${selected.has(s.id)?'background:rgba(61,217,194,.09)':''}"><input type="checkbox" data-knowledge-source="${esc(s.id)}" ${selected.has(s.id)?'checked':''}> <b>${esc(s.id)}</b> · ${esc(s.organization)} — ${esc(s.title)}<br><small>${esc(s.category)} · ${esc(s.zdr_posture)}</small> <a href="${esc(s.url)}" target="_blank" rel="noreferrer">source</a></label>`).join('');
  document.querySelectorAll('[data-knowledge-source]').forEach(box=>box.onchange=()=>{const ids=new Set(knowledgeState.matched_source_ids);box.checked?ids.add(box.dataset.knowledgeSource):ids.delete(box.dataset.knowledgeSource);knowledgeState.matched_source_ids=[...ids];const selectedSources=kb.sources.filter(s=>ids.has(s.id));knowledgeState.questionnaire=buildQuestionnaire(knowledgeState,selectedSources);localStorage.setItem('loftsims-zdr-knowledge-v06',JSON.stringify(knowledgeState));renderKnowledge()});
}
function renderKnowledge(){
  document.getElementById('knowledgeResult').textContent=JSON.stringify({schema:'loftsims.zdr.knowledge-selection/v1',...knowledgeState,source_count:knowledgeState.matched_source_ids.length,question_count:knowledgeState.questionnaire.length},null,2);
  document.getElementById('knowledgeQuestions').innerHTML=knowledgeState.questionnaire.length?knowledgeState.questionnaire.map(q=>`<article class="card sap-question"><div class="sap-qtop"><div class="sap-qid">${esc(q.anchor_id||'EXT')}</div><div><h3>${esc(q.question)}</h3><p>${esc(q.origin)}${q.source_id?' · '+esc(q.source_id):''}</p></div></div></article>`).join(''):'<p class="empty">Confirm the system class to generate questions.</p>';
  renderSources();
}
function match(){
  knowledgeState={profile:document.getElementById('knowledgeProfile').value,confirmed:document.getElementById('knowledgeConfirmed').checked,system_type:document.getElementById('knowledgeSystem').value.trim(),provider:document.getElementById('knowledgeProvider').value.trim(),product:document.getElementById('knowledgeProduct').value.trim(),features:document.getElementById('knowledgeFeatures').value.split(',').map(x=>x.trim()).filter(Boolean),selected_source_id:document.getElementById('knowledgePreset').value,matched_source_ids:[],questionnaire:[],generated_at:new Date().toISOString()};
  if(!knowledgeState.confirmed){alert('Human confirmation is required before applying a tailored questionnaire.');renderKnowledge();return}
  const matches=matchingSources(knowledgeState);knowledgeState.matched_source_ids=matches.map(x=>x.id);knowledgeState.questionnaire=buildQuestionnaire(knowledgeState,matches);localStorage.setItem('loftsims-zdr-knowledge-v06',JSON.stringify(knowledgeState));renderKnowledge();
}
function clearKnowledge(){knowledgeState={profile:'generic',confirmed:false,system_type:'',provider:'',product:'',features:[],selected_source_id:'',matched_source_ids:[],questionnaire:[],generated_at:null};localStorage.removeItem('loftsims-zdr-knowledge-v06');['knowledgeSystem','knowledgeProvider','knowledgeProduct','knowledgeFeatures','knowledgePreset'].forEach(id=>document.getElementById(id).value='');document.getElementById('knowledgeProfile').value='generic';document.getElementById('knowledgeConfirmed').checked=false;renderKnowledge()}
function artifacts(){const matched=kb.sources.filter(s=>knowledgeState.matched_source_ids.includes(s.id));return{schema:'loftsims.zdr.knowledge-artifacts/v1',knowledge_snapshot:{release:kb.release,date:kb.snapshot_date},classification:knowledgeState,source_applicability:matched.map(s=>({source_id:s.id,organization:s.organization,product:s.product,zdr_posture:s.zdr_posture,anchor_vector:s.anchor_vector,verification:s.verification,url:s.url})),questionnaire:knowledgeState.questionnaire,evidence_request_manifest:knowledgeState.questionnaire.map(q=>({question_id:q.question_id,anchor_id:q.anchor_id,required_evidence:q.source_id?'contract, configuration, and runtime evidence':'installation-specific evidence',source_id:q.source_id||null}))}}

knowledgeNav.onclick=()=>nav('knowledge');
document.getElementById('matchKnowledge').onclick=match;
document.getElementById('knowledgePreset').onchange=e=>{const s=kb.sources.find(x=>x.id===e.target.value);if(!s)return;document.getElementById('knowledgeProvider').value=s.organization;document.getElementById('knowledgeProduct').value=s.product;document.getElementById('knowledgeSystem').value=s.product;document.getElementById('knowledgeProfile').value=s.category==='model_api_provider'?'model_api':s.category==='enterprise_ai_product'?'enterprise_app':s.category==='assessment_and_governance'?'governance':'generic'};
document.getElementById('clearKnowledge').onclick=clearKnowledge;
document.getElementById('knowledgeClearBottom').onclick=clearKnowledge;
document.getElementById('knowledgeBack').onclick=()=>nav('flavor');
document.getElementById('knowledgeContinue').onclick=()=>knowledgeState.confirmed?nav('current'):alert('Confirm and match the source system first.');
document.getElementById('downloadKnowledge').onclick=()=>download('loftsims-zdr-knowledge-artifacts-v0.6.0.json',JSON.stringify(artifacts(),null,2),'application/json');

const baseYaml=sapYaml;sapYaml=function(){let text=baseYaml();const k=['knowledge_selection:','  profile: '+JSON.stringify(knowledgeState.profile),'  human_confirmed: '+knowledgeState.confirmed,'  system_type: '+JSON.stringify(knowledgeState.system_type),'  provider: '+JSON.stringify(knowledgeState.provider),'  product: '+JSON.stringify(knowledgeState.product),'  matched_source_ids: ['+knowledgeState.matched_source_ids.map(JSON.stringify).join(', ')+']','  tailored_question_ids: ['+knowledgeState.questionnaire.map(q=>JSON.stringify(q.question_id)).join(', ')+']'];return text+k.join('\n')+'\n'};
const baseAssessment=runAssessment;runAssessment=function(){baseAssessment();if(!assessment)return;const a=artifacts();assessment.knowledge_snapshot=a.knowledge_snapshot;assessment.source_system_classification=a.classification;assessment.source_applicability=a.source_applicability;assessment.tailored_questionnaire=a.questionnaire;assessment.evidence_request_manifest=a.evidence_request_manifest;assessment.anchor_vector=kb.anchors.map(anchor=>{const related=(assessment.findings||[]).filter(f=>String(f.finding_id).includes(anchor.id)||String(f.component).includes(anchor.id));return{anchor_id:anchor.id,factor:anchor.factor,result:related.some(x=>x.result==='failed')?'failed':related.some(x=>x.result==='passed')?'passed':'not_verified',source_ids:knowledgeState.matched_source_ids.filter(id=>{const s=kb.sources.find(x=>x.id===id);return s&&s.anchor_vector[anchor.id].coverage!=='not_covered'})}});document.getElementById('assessmentJson').value=JSON.stringify(assessment,null,2)};
document.getElementById('assess').onclick=runAssessment;
const baseRecommendation=runRecommendation;runRecommendation=function(){baseRecommendation();if(!recommendation)return;const matched=kb.sources.filter(s=>knowledgeState.matched_source_ids.includes(s.id));recommendation+='\n\n## Applicable knowledge sources\n'+(matched.length?matched.map(s=>`- **${s.id}** — ${s.organization}, ${s.title}: ${s.url}`).join('\n'):'No source match was confirmed.')+'\n\nPublished knowledge informs evidence requests and does not independently verify installation ZDR.\n';document.getElementById('recommendationText').textContent=recommendation};
document.getElementById('recommend').onclick=runRecommendation;
const baseProject=completeProject;completeProject=function(){return{...baseProject(),schema:'loftsims.zdr.project/v0.6.0',knowledge_artifacts:artifacts()}};
document.getElementById('exportProject').onclick=()=>download('loftsims-zdr-complete-v0.6.0.json',JSON.stringify(completeProject(),null,2),'application/json');
document.getElementById('reset').onclick=()=>{if(confirm('Clear the local project?')){localStorage.removeItem('loftsims-complete-zdr-v06');localStorage.removeItem('loftsims-zdr-knowledge-v06');location.reload()}};
workflowStages.splice(3,0,['knowledge','Knowledge match']);
try{const stored=JSON.parse(localStorage.getItem('loftsims-zdr-knowledge-v06'));if(stored){knowledgeState=stored;document.getElementById('knowledgeProfile').value=stored.profile||'generic';document.getElementById('knowledgePreset').value=stored.selected_source_id||'';document.getElementById('knowledgeSystem').value=stored.system_type||'';document.getElementById('knowledgeProvider').value=stored.provider||'';document.getElementById('knowledgeProduct').value=stored.product||'';document.getElementById('knowledgeFeatures').value=(stored.features||[]).join(', ');document.getElementById('knowledgeConfirmed').checked=!!stored.confirmed}}catch{}
const systemFlavorMap={'SAP / Joule':'sap_joule_zdr','Salesforce / Agentforce':'salesforce_agentforce_zdr','Microsoft 365 Copilot':'microsoft_copilot_zdr','ServiceNow AI':'servicenow_ai_zdr','OpenAI API':'openai_api_zdr','Anthropic Claude API':'anthropic_api_zdr','Google Cloud Gemini / Vertex AI':'google_gemini_vertex_zdr','Amazon Bedrock':'aws_bedrock_zdr','Oracle OCI Generative AI':'oracle_oci_genai_zdr','Cohere':'cohere_zdr','Mistral AI':'mistral_ai_zdr','Custom AI / RAG application':'custom_rag_zdr','Agentic AI system':'agentic_ai_zdr','AI governance or control platform':'ai_governance_zdr','Other AI Technology':'generic_ai_product_zdr'};
document.getElementById('sapSystemType').addEventListener('change',e=>{const type=e.target.value;document.getElementById('sapFlavorName').value=systemFlavorMap[type]||'generic_ai_product_zdr';document.getElementById('knowledgeSystem').value=type;const lower=type.toLowerCase();document.getElementById('knowledgeProfile').value=lower.includes('api')||lower.includes('bedrock')||lower.includes('gemini')||lower.includes('oci')||lower==='cohere'||lower.includes('mistral')?'model_api':lower.includes('rag')?'custom_rag':lower.includes('agentic')?'agentic':lower.includes('governance')?'governance':type?'enterprise_app':'generic'});
renderKnowledge();
})();
