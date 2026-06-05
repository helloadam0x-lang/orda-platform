import { Plan, PlanFeatures } from "@/types";

export const PLANS: Plan[] = [
  {
    id: "trial",
    name: "trial",
    price: 0,
    currency: "USD",
    interval: "month",
    color: "#8892A4",
    description: "Try Orda free for 7 days. No credit card required.",
    features: {
      textReplies: true,
      voiceMessages: false,
      humanHandoff: true,
      staffRouting: false,
      dashboard: true,
      crm: false,
      broadcast: false,
      payments: false,
      storefront: false,
      weeklyReport: false,
      omnichannel: false,
      messageLimit: 100,
      deliveryManagement: false,
      inventoryTracking: false,
      multiPlatform: false,
    },
    is_active: true,
  },
  {
    id: "starter",
    name: "starter",
    price: 29,
    currency: "USD",
    interval: "month",
    color: "#8729A0",
    description: "Everything you need to automate customer conversations.",
    features: {
      textReplies: true,
      voiceMessages: true,
      humanHandoff: true,
      staffRouting: true,
      dashboard: true,
      crm: true,
      broadcast: false,
      payments: false,
      storefront: false,
      weeklyReport: true,
      omnichannel: false,
      messageLimit: 1000,
      deliveryManagement: false,
      inventoryTracking: false,
      multiPlatform: false,
    },
    is_active: true,
  },
  {
    id: "growth",
    name: "growth",
    price: 59,
    currency: "USD",
    interval: "month",
    color: "#6a1f80",
    description: "Scale your business with advanced automation and commerce.",
    features: {
      textReplies: true,
      voiceMessages: true,
      humanHandoff: true,
      staffRouting: true,
      dashboard: true,
      crm: true,
      broadcast: true,
      payments: true,
      storefront: true,
      weeklyReport: true,
      omnichannel: false,
      messageLimit: 5000,
      deliveryManagement: true,
      inventoryTracking: false,
      multiPlatform: false,
    },
    is_active: true,
  },
  {
    id: "premium",
    name: "premium",
    price: 99,
    currency: "USD",
    interval: "month",
    color: "#E4F0F6",
    description: "The complete Orda suite for enterprise-grade businesses.",
    features: {
      textReplies: true,
      voiceMessages: true,
      humanHandoff: true,
      staffRouting: true,
      dashboard: true,
      crm: true,
      broadcast: true,
      payments: true,
      storefront: true,
      weeklyReport: true,
      omnichannel: true,
      messageLimit: -1,
      deliveryManagement: true,
      inventoryTracking: true,
      multiPlatform: true,
    },
    is_active: true,
  },
];

export function getPlanColor(planName: string): string {
  const plan = PLANS.find((p) => p.name === planName);
  return plan?.color ?? "#8892A4";
}

export function getDaysRemaining(subscription: {
  current_period_end: string;
}): number {
  const end = new Date(subscription.current_period_end);
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function isFeatureAvailable(
  planName: string,
  feature: keyof PlanFeatures
): boolean {
  const plan = PLANS.find((p) => p.name === planName);
  if (!plan) return false;
  const value = plan.features[feature];
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  return false;
}

export function getPlanByPrice(price: number): Plan | undefined {
  return PLANS.find((p) => p.price === price);
}
