// Shared state management for handover and holidays prototype
// Uses localStorage so names and answers persist across pages

const STATE_KEY = 'cap-hh-prototype';

function getState() {
  try {
    return JSON.parse(localStorage.getItem(STATE_KEY) || '{}');
  } catch (e) {
    return {};
  }
}

function setState(updates) {
  const current = getState();
  localStorage.setItem(STATE_KEY, JSON.stringify(deepMerge(current, updates)));
}

function clearState() {
  localStorage.removeItem(STATE_KEY);
}

function getNames() {
  const s = getState();
  return {
    parent1: s.parent1Name || 'Parent 1',
    parent2: s.parent2Name || 'Parent 2',
    children: s.children || []
  };
}

// Deep merge — arrays are replaced, not merged
function deepMerge(target, source) {
  if (typeof source !== 'object' || source === null) return source;
  if (Array.isArray(source)) return source;
  const result = Object.assign({}, target);
  for (const key of Object.keys(source)) {
    const sv = source[key];
    const tv = target[key];
    if (sv && typeof sv === 'object' && !Array.isArray(sv) && tv && typeof tv === 'object' && !Array.isArray(tv)) {
      result[key] = deepMerge(tv, sv);
    } else {
      result[key] = sv;
    }
  }
  return result;
}

// ─── Design 2 helpers ────────────────────────────────────────────────────────

function initChildPlans() {
  const s = getState();
  const children = s.children || [];
  const existing = (s.design2 && s.design2.childPlans) || [];
  const plans = children.map((_, i) => existing[i] || { answers: {} });
  setState({ design2: { childPlans: plans } });
}

function getChildPlan(childIndex) {
  const s = getState();
  const plans = (s.design2 && s.design2.childPlans) || [];
  return plans[childIndex] || { answers: {} };
}

function setChildPlan(childIndex, updates) {
  const s = getState();
  const d2 = s.design2 || {};
  const plans = [...(d2.childPlans || [])];
  while (plans.length <= childIndex) plans.push({ answers: {} });
  plans[childIndex] = deepMerge(plans[childIndex] || { answers: {} }, updates);
  setState({ design2: { childPlans: plans } });
}

function getCurrentChildIndex() {
  const s = getState();
  return (s.design2 && typeof s.design2.currentChildIndex === 'number')
    ? s.design2.currentChildIndex : 0;
}

function setCurrentChildIndex(idx) {
  setState({ design2: { currentChildIndex: idx } });
}

function copyChildPlan(fromIndex, toIndex) {
  const s = getState();
  const plans = (s.design2 && s.design2.childPlans) || [];
  const source = plans[fromIndex];
  if (!source) return;
  setChildPlan(toIndex, { answers: Object.assign({}, source.answers) });
}

function applyAnswerToAllChildren(answerUpdates) {
  const s = getState();
  const children = s.children || [];
  const plans = [...((s.design2 && s.design2.childPlans) || [])];
  children.forEach((_, i) => {
    const plan = plans[i] || { answers: {} };
    plan.answers = Object.assign({}, plan.answers, answerUpdates);
    plans[i] = plan;
  });
  setState({ design2: { childPlans: plans } });
}

function isChildPlanStarted(childIndex) {
  const a = getChildPlan(childIndex).answers || {};
  return a.getBetweenHouseholds != null;
}

function isChildPlanComplete(childIndex) {
  const a = getChildPlan(childIndex).answers || {};
  return a.itemsForChangeover != null;
}

// ─── Design 3 helpers ────────────────────────────────────────────────────────

function getDesign3() {
  const s = getState();
  return (s.design3) || {};
}

function setDesign3(updates) {
  const d3 = getDesign3();
  setState({ design3: deepMerge(d3, updates) });
}

// ─── Design 2: per-question helpers ──────────────────────────────────────────

function isD2QuestionAnsweredForChild(qKey, childIndex) {
  const plan = getChildPlan(childIndex);
  return !!(plan.answers && plan.answers[qKey] != null);
}

function isD2QuestionComplete(qKey) {
  const { children } = getNames();
  return children.length > 0 && children.every((_, i) => isD2QuestionAnsweredForChild(qKey, i));
}

function isD2Q3Complete() {
  const { children } = getNames();
  return children.length > 0 && children.every((_, i) => {
    const a = getChildPlan(i).answers || {};
    if (!a.willChangeDuringHolidays) return false;
    if (a.willChangeDuringHolidays === 'Yes') return !!a.howChangeDuringHolidays;
    return true;
  });
}

function getFirstUnansweredChildForQuestion(qKey) {
  const { children } = getNames();
  for (let i = 0; i < children.length; i++) {
    if (!isD2QuestionAnsweredForChild(qKey, i)) return i;
  }
  return 0;
}

// ─── Design 3: per-question helpers ──────────────────────────────────────────

function getD3Question(qKey) {
  return getDesign3()[qKey] || {};
}

function setD3AllAnswer(qKey, answer) {
  setDesign3({ [qKey]: { mode: 'all', allAnswer: answer } });
}

function setD3PerChildAnswer(qKey, childIndex, answer) {
  const existing = getD3Question(qKey);
  const perChildAnswers = [...(existing.perChildAnswers || [])];
  while (perChildAnswers.length <= childIndex) perChildAnswers.push(null);
  perChildAnswers[childIndex] = answer;
  setDesign3({ [qKey]: { mode: 'perChild', perChildAnswers } });
}

function isD3QuestionComplete(qKey) {
  const q = getD3Question(qKey);
  if (!q.mode) return false;
  if (q.mode === 'all') return !!q.allAnswer;
  const { children } = getNames();
  return children.length > 0 && children.every((_, i) => !!(q.perChildAnswers || [])[i]);
}

// ─── Design 2: Living & visiting completion helpers ───────────────────────────

function isD2LVOvernightsComplete() {
  const { children } = getNames();
  return children.length > 0 && children.every((_, i) => {
    const a = getChildPlan(i).answers || {};
    if (!a.willOvernightsHappen) return false;
    if (a.willOvernightsHappen === 'Yes') return !!(a.whichDaysOvernight && a.whichDaysOvernight.length);
    return true;
  });
}

function isD2LVDaytimeComplete() {
  const { children } = getNames();
  return children.length > 0 && children.every((_, i) => {
    const a = getChildPlan(i).answers || {};
    if (!a.willDaytimeVisitsHappen) return false;
    if (a.willDaytimeVisitsHappen === 'Yes') return !!(a.whichDaysDaytimeVisits && a.whichDaysDaytimeVisits.length);
    return true;
  });
}

// ─── Design 3: Living & visiting conditional completion helpers ───────────────

function isD3LVOvernightsComplete() {
  const q = getD3Question('willOvernightsHappen');
  if (!q.mode) return false;
  const hasYes = (q.mode === 'all' && q.allAnswer && q.allAnswer.answer === 'Yes') ||
    (q.mode === 'perChild' && (q.perChildAnswers || []).some(a => a && a.answer === 'Yes'));
  if (!hasYes) {
    if (q.mode === 'all') return !!q.allAnswer;
    const { children } = getNames();
    return children.length > 0 && children.every((_, i) => !!(q.perChildAnswers || [])[i]);
  }
  const od = getD3Question('whichDaysOvernight');
  if (!od.mode) return false;
  if (od.mode === 'all') return !!(od.allAnswer && od.allAnswer.days && od.allAnswer.days.length);
  const { children } = getNames();
  return children.length > 0 && children.every((_, i) => {
    const willOv = (q.perChildAnswers || [])[i];
    if (!willOv) return false;
    if (willOv.answer !== 'Yes') return true;
    const ovDays = (od.perChildAnswers || [])[i];
    return !!(ovDays && ovDays.days && ovDays.days.length);
  });
}

function isD3LVDaytimeComplete() {
  const q = getD3Question('willDaytimeVisitsHappen');
  if (!q.mode) return false;
  const hasYes = (q.mode === 'all' && q.allAnswer && q.allAnswer.answer === 'Yes') ||
    (q.mode === 'perChild' && (q.perChildAnswers || []).some(a => a && a.answer === 'Yes'));
  if (!hasYes) {
    if (q.mode === 'all') return !!q.allAnswer;
    const { children } = getNames();
    return children.length > 0 && children.every((_, i) => !!(q.perChildAnswers || [])[i]);
  }
  const dv = getD3Question('whichDaysDaytimeVisits');
  if (!dv.mode) return false;
  if (dv.mode === 'all') return !!(dv.allAnswer && dv.allAnswer.days && dv.allAnswer.days.length);
  const { children } = getNames();
  return children.length > 0 && children.every((_, i) => {
    const willDt = (q.perChildAnswers || [])[i];
    if (!willDt) return false;
    if (willDt.answer !== 'Yes') return true;
    const dtDays = (dv.perChildAnswers || [])[i];
    return !!(dtDays && dtDays.days && dtDays.days.length);
  });
}

// ─── Decision Making helpers (shared by both designs) ─────────────────────────

function getDMAnswer(key) {
  const s = getState();
  return s.decisionMaking ? s.decisionMaking[key] : undefined;
}

function setDMAnswer(key, value) {
  setState({ decisionMaking: { [key]: value } });
}

function isDMComplete(key) {
  return getDMAnswer(key) != null;
}
