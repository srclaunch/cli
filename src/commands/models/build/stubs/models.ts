export function getDocumentModel() {
  return `import { ModelProps, Primitives } from "@srclaunch/types";

  export const Document: ModelProps = {
    fields: {
      name: {
        label: "Name",
        type: Primitives.String,
        required: true,
      },
      description: {
        label: "Description",
        type: Primitives.String,
        required: true,
      }
    },
    name: "Document",
    relationships: {
      belongsTo: ["Organization", "Invoice", "User"],
    },
  };
  `;
}

export function getMessageModel() {
  return `import { ModelProps, Primitives } from "@srclaunch/types";

  export const Message: ModelProps = {
    fields: {
      message: {
        label: "Message",
        type: Primitives.String,
        required: true,
      },
      recipient: {
        label: "Recipient",
        type: Primitives.String,
        required: false,
      }
    },
    name: "Message",
    relationships: {
      belongsTo: ["Organization", "User"],
    },
  };`;
}

export function getInvoiceModel() {
  return `import { ModelProps, Primitives } from "@srclaunch/types";

  export const Invoice: ModelProps = {
    fields: {
      amount: {
        label: "Amount",
        type: Primitives.Number,
        required: true,
      },
      currency: {
        label: "Currency",
        type: Primitives.CurrencyCode,
        required: true,
      },
      date: {
        label: "Date",
        type: Primitives.Date,
        required: true,
      },
      due_date: {
        label: "Due Date",
        type: Primitives.Date,
        required: true,
      },
      notes: {
        label: "Notes",
        type: Primitives.String,
      },
      status: {
        label: "Status",
        type: Primitives.String,
        required: true,
      },
    },
    name: "Invoice",
    relationships: {
      belongsTo: ["Organization", "Payment", "User"],
    },
  };`;
}

export function getOrganizationModel() {
  return `import { ModelProps, Primitives } from "@srclaunch/types";

export const Organization: ModelProps = {
  fields: {
    description: {
      label: "Description",
      type: Primitives.String,
    },
    name: {
      label: "Name",
      type: Primitives.String,
    },
  },
  name: "Organization",
  relationships: {},
};`;
}

export function getPaymentModel() {
  return `import { ModelProps, Primitives } from "@srclaunch/types";

  export const Payment: ModelProps = {
    fields: {
      amount: {
        label: "Amount",
        type: Primitives.Number,
        required: true,
      },
      currency: {
        label: "Currency",
        type: Primitives.CurrencyCode,
        required: true,
      },
      date: {
        label: "Date",
        type: Primitives.Date,
        required: true,
      },
      failure_reason: {
        label: "Failure Reason",
        type: Primitives.Menu,
        menu: [
          {
            label: 'Insufficient Funds',
            value: 'insufficient-funds',
          },
          {
            label: 'Invalid Amount',
            value: 'invalid-amount',
          },
          {
            label: 'Invalid Currency',
            value: 'invalid-currency',
          },
          {
            label: 'Invalid Card',
            value: 'invalid-card',
          },
          {
            label: 'Invalid Card Expiry',
            value: 'invalid-card-expiry',
          },
          {
            label: 'Invalid Card Number',
            value: 'invalid-card-number',
          },
          {
            label: 'Invalid Card Security Code',
            value: 'invalid-card-security-code',
          },
          {
            label: 'Invalid Card Holder',
            value: 'invalid-card-holder',
          },
          {
            label: 'Invalid Card Address',
            value: 'invalid-card-address',
          },
        ]
      },
      notes: {
        label: "Notes",
        type: Primitives.String,
        required: true,
      },
      status: {
        label: "Status",
        type: Primitives.Menu,
        required: true,
        menu: [
          {
            label: "Paid",
            value: "paid",
          },
          {
            label: "Failure",
            value: "failure",
          },
          {
            label: "Pending",
            value: "pending",
          },
        ],
      }
    },
    name: "Payment",
    relationships: {
      belongsTo: ["Organization", "User"],
    },
  };`;
}

export function getPaymentMethodModel() {
  return `import { ModelProps, Primitives } from "@srclaunch/types";

export const PaymentMethod: ModelProps = {
  fields: {
    default: {
      label: "Default",
      type: Primitives.Boolean,
    },
    masked_number: {
      label: "Number",
      type: Primitives.String,
    },
    name: {
      label: "Name",
      type: Primitives.String,
    },
    type: {
      label: "Type",
      menu: [
        {
          label: "Bank Transfer",
          value: "bank-transfer",
        },
        {
          label: "Credit Card",
          value: "credit-card",
        },
        {
          label: "Crypto",
          value: "crypto",
        },
      ],
      type: Primitives.Menu,
    },
  },
  name: "PaymentMethod",
  relationships: {
    belongsTo: ["Organization", "Payment", "Team", "User"],
  },
};`;
}

export function getPersonModel() {
  return `import { ModelProps, Primitives } from "@srclaunch/types";

export const Person: ModelProps = {
  fields: {
    analytics: {
      label: "Analytics",
      type: Primitives.JSON,
    },
    billing: {
      label: "Billing Details",
      type: Primitives.JSON,
    },
  },
  name: "Person",
  relationships: {
    hasMany: ["Event"],
    hasOne: ["User"],
  },
};`;
}

export function getSubscriptionModel() {
  return `import { ModelProps, Primitives } from "@srclaunch/types";

export const Subscription: ModelProps = {
  fields: {
    status: {
      label: "Status",
      menu: [
        {
          label: "Active",
          value: "active",
        },
        {
          label: "Expired",
          value: "expired",
        },
        {
          label: "Canceled",
          value: "canceled",
        },
      ],
      type: Primitives.Menu,
    },
    cancel_date: {
      label: "Cancel date",
      type: Primitives.DateTime,
    },
    expiration_date: {
      label: "Expiration date",
      type: Primitives.DateTime,
    },
    renewal_date: {
      label: "Renewal date",
      type: Primitives.DateTime,
    },
    start_date: {
      label: "Start date",
      type: Primitives.DateTime,
    },
  },
  name: "Subscription",
  relationships: {
    belongsTo: ["Organization", "Product", "Team", "User"],
  },
};`;
}


export function getTeamModel() {
  return `import { ModelProps, Primitives } from "@srclaunch/types";

export const Team: ModelProps = {
  fields: {
    description: {
      label: "Description",
      type: Primitives.String,
    },
    name: {
      label: "Name",
      type: Primitives.String,
    },
  },
  name: "Team",
  relationships: {
    belongsTo: ["Organization"],
  },
};`;
}

export function getUserModel() {
  return `import {
  CurrencyCode,
  LanguageCode,
  LocaleCode,
  ModelProps,
  Primitives,
} from "@srclaunch/types";

export const User: ModelProps = {
  description: "A user that signs into the application",
  fields: {
    access: {
      label: "Access Details",
      type: Primitives.JSON,
    },
    cognito_id: {
      label: "Cognito ID",
      type: Primitives.String,
    },
    membership: {
      label: "Membership",
      type: Primitives.JSON,
    },
    onboarding: {
      label: "Onboarding",
      type: Primitives.JSON,
    },
    preferences: {
      defaultValue: {
        accessibility: {
          outlines: false,
        },
        localization: {
          currency: CurrencyCode.UnitedStatesDollar,
          language: LanguageCode.English,
          locale: LocaleCode.EnglishUnitedStates,
        },
        look_and_feel: {
          theme: "light",
        },
      },
      label: "Preferences",
      type: Primitives.JSON,
    },
  },
  name: "User",
  relationships: {
    belongsTo: ["Person", "Team"]
  },
};`;
}

export function getUserGroupModel() {
  return `import { ModelProps, Primitives } from "@srclaunch/types";

export const UserGroup: ModelProps = {
  fields: {
    description: {
      label: "Description",
      type: Primitives.String,
    },
    name: {
      label: "Name",
      type: Primitives.String,
    },
  },
  name: "UserGroup",
  relationships: {
    belongsTo: ["Organization", "Team"],
  },
};`;
}

export function getUserRoleModel() {
  return `import { ModelProps, Primitives } from "@srclaunch/types";

export const UserRole: ModelProps = {
  fields: {
    description: {
      label: "Description",
      type: Primitives.String,
    },
    name: {
      label: "Name",
      type: Primitives.String,
    },
  },
  name: "UserRole",
  relationships: {
    belongsTo: ["Organization", "Team"],
  },
};`;
}
