/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request } from 'express';
import { SessionData } from 'express-session';

import { CAPSession } from '../@types/session';

import { formatListOfStrings } from './formValueUtils';
import { isDesign2, getSessionValue } from './perChildSession';
import { validateRedirectUrl } from './redirectValidator';

export const formattedChildrenNames = (request: Request) =>
  formatListOfStrings(request.session.namesOfChildren, request);

// Helper to get the 'where' value from mostlyLive, handling both old and new formats
const getMostlyLiveWhere = (mostlyLive: any): string | undefined => {
  if (!mostlyLive) return undefined;
  // New PerChildAnswer format
  if (mostlyLive.default?.where) return mostlyLive.default.where;
  // Legacy format
  return mostlyLive.where;
};

export const parentMostlyLivedWith = (session: Partial<CAPSession>) => {
  const livingAndVisiting = getSessionValue<any>(session, 'livingAndVisiting');
  const where = getMostlyLiveWhere(livingAndVisiting?.mostlyLive);
  return where === 'withInitial' ? session.initialAdultName : session.secondaryAdultName;
};

export const parentNotMostlyLivedWith = (session: Partial<CAPSession>) => {
  const livingAndVisiting = getSessionValue<any>(session, 'livingAndVisiting');
  const where = getMostlyLiveWhere(livingAndVisiting?.mostlyLive);
  return where === 'withInitial' ? session.secondaryAdultName : session.initialAdultName;
};

const checkAllChildren = (session: Partial<CAPSession>, check: (plan: any) => boolean): boolean => {
  if (!session.childPlans?.length) return false;
  return session.childPlans.every(plan => check(plan));
};

export const mostlyLiveComplete = (session: Partial<CAPSession>) => {
  if (isDesign2(session)) {
    return checkAllChildren(session, plan => {
      const lv = plan.livingAndVisiting;
      if (!lv?.mostlyLive) return false;
      const where = getMostlyLiveWhere(lv.mostlyLive);
      if (where === 'split') return !!lv.whichSchedule;
      return true; // 'other', 'withInitial', 'withSecondary' — mostlyLive answered is enough
    });
  }
  const livingAndVisiting = getSessionValue<any>(session, 'livingAndVisiting');
  if (!livingAndVisiting?.mostlyLive) return false;

  const { mostlyLive, overnightVisits, daytimeVisits, whichSchedule } = livingAndVisiting;
  const where = getMostlyLiveWhere(mostlyLive);

  if (where === 'other') {
    return true;
  }
  if (where === 'split') {
    return !!whichSchedule;
  }

  const overnightComplete =
    overnightVisits?.willHappen !== undefined && (!overnightVisits.willHappen || !!overnightVisits.whichDays);
  const daytimeVisitsComplete =
    daytimeVisits?.willHappen !== undefined && (!daytimeVisits.willHappen || !!daytimeVisits.whichDays);
  return overnightComplete && daytimeVisitsComplete;
};

export const getBetweenHouseholdsComplete = (session: Partial<CAPSession>) => {
  if (isDesign2(session)) {
    return checkAllChildren(session, plan => !!plan.handoverAndHolidays?.getBetweenHouseholds);
  }
  const handoverAndHolidays = getSessionValue<any>(session, 'handoverAndHolidays');
  return !!handoverAndHolidays?.getBetweenHouseholds;
};

export const whereHandoverComplete = (session: Partial<CAPSession>) => {
  if (isDesign2(session)) {
    return checkAllChildren(session, plan => !!plan.handoverAndHolidays?.whereHandover);
  }
  const handoverAndHolidays = getSessionValue<any>(session, 'handoverAndHolidays');
  return !!handoverAndHolidays?.whereHandover;
};

export const willChangeDuringSchoolHolidaysComplete = (session: Partial<CAPSession>) => {
  if (isDesign2(session)) {
    return checkAllChildren(session, plan => {
      const hah = plan.handoverAndHolidays;
      if (!hah?.willChangeDuringSchoolHolidays) return false;
      return !(hah.willChangeDuringSchoolHolidays.willChange && !hah.howChangeDuringSchoolHolidays);
    });
  }
  const handoverAndHolidays = getSessionValue<any>(session, 'handoverAndHolidays');
  if (!handoverAndHolidays?.willChangeDuringSchoolHolidays) return false;

  return !(
    handoverAndHolidays.willChangeDuringSchoolHolidays.willChange && !handoverAndHolidays.howChangeDuringSchoolHolidays
  );
};

export const itemsForChangeoverComplete = (session: Partial<CAPSession>) => {
  if (isDesign2(session)) {
    return checkAllChildren(session, plan => !!plan.handoverAndHolidays?.itemsForChangeover);
  }
  const handoverAndHolidays = getSessionValue<any>(session, 'handoverAndHolidays');
  return !!handoverAndHolidays?.itemsForChangeover;
};

export const whatWillHappenComplete = (session: Partial<CAPSession>) => {
  if (isDesign2(session)) {
    return checkAllChildren(session, plan => !!plan.specialDays?.whatWillHappen);
  }
  const specialDays = getSessionValue<any>(session, 'specialDays');
  return !!specialDays?.whatWillHappen;
};

export const whatOtherThingsMatterComplete = (session: Partial<CAPSession>) => {
  if (isDesign2(session)) {
    return checkAllChildren(session, plan => !!plan.otherThings?.whatOtherThingsMatter);
  }
  const otherThings = getSessionValue<any>(session, 'otherThings');
  return !!otherThings?.whatOtherThingsMatter;
};

export const planLastMinuteChangesComplete = (session: Partial<CAPSession>) => {
  if (isDesign2(session)) {
    return checkAllChildren(session, plan => !!plan.decisionMaking?.planLastMinuteChanges);
  }
  const decisionMaking = getSessionValue<any>(session, 'decisionMaking');
  return !!decisionMaking?.planLastMinuteChanges;
};

export const planLongTermNoticeComplete = (session: Partial<CAPSession>) => {
  if (isDesign2(session)) {
    return checkAllChildren(session, plan => !!plan.decisionMaking?.planLongTermNotice);
  }
  const decisionMaking = getSessionValue<any>(session, 'decisionMaking');
  return !!decisionMaking?.planLongTermNotice;
};

export const planReviewComplete = (session: Partial<CAPSession>) => {
  if (isDesign2(session)) {
    return checkAllChildren(session, plan => !!plan.decisionMaking?.planReview);
  }
  const decisionMaking = getSessionValue<any>(session, 'decisionMaking');
  return !!decisionMaking?.planReview;
};

export const getBackUrl = (session: Partial<SessionData>, defaultUrl: string) => {
  if (!session.previousPage) {
    return defaultUrl;
  }
  return validateRedirectUrl(session.previousPage, defaultUrl);
};

export const getRedirectUrlAfterFormSubmit = (session: Partial<SessionData>, defaultUrl: string) => {
  // If the user came directly from check answers page, redirect back there
  const previousPage = session.previousPage;
  if (previousPage === '/check-your-answers') {
    return validateRedirectUrl(previousPage, defaultUrl);
  }
  // defaultUrl is already from paths enum, so it's safe
  return defaultUrl;
};
