
// ==============================================
// WeCall SMS Platform – Full Mock Data
// Normalized and structured for all modules
// ==============================================

// ==============================================
// WeCall SMS Platform – Full Mock Data
// Normalized and structured for all modules
// ==============================================

export const wecallMockData = {
  platform_account: {
    account_sid: "AC_PLATFORM_0001",
    name: "WeCall Platform",
    type: "PLATFORM",
    country: "Rwanda",
    status: "active",
  },

  // ------------------------------------------------------
  // RESELLERS
  // ------------------------------------------------------
  resellers: [
    {
      account_sid: "AC_RESELLER_1001",
      business_username: "kcb",
      name: "KCB Bank",
      type: "RESELLER",
      status: "active",
      created_at: "2025-01-10T09:30:00Z",

      billing: {
        wallet_balance: 1200.5,
        credit_limit: 5000,
        currency: "USD",
        last_topup: "2025-02-01T09:00:00Z",
      },

      sms_usage: {
        this_month_outbound: 125000,
        this_month_inbound: 1900,
        success_rate: 0.982,
        failed: 2100,
      },

      // CLIENTS under this reseller
      clients: [
        {
          account_sid: "AC_CLIENT_2001",
          business_username: "rdb",
          name: "Rwanda Development Board",
          type: "CLIENT",
          status: "active",
          parent_reseller_sid: "AC_RESELLER_1001",
          created_at: "2025-01-15T08:15:00Z",

          staff: [
            { id: "STF001", name: "Alice Mukamana", role: "Boss", email: "alice@rdb.gov.rw" },
            { id: "STF002", name: "Jean Pierre", role: "Finance", email: "finance@rdb.gov.rw" },
            { id: "STF003", name: "Eric Mugisha", role: "Tech", email: "it@rdb.gov.rw" },
          ],

          billing: {
            wallet_balance: 350.75,
            credit_limit: 500,
            currency: "USD",
          },

          sms_usage: {
            this_month_outbound: 48000,
            today_outbound: 2200,
            success_rate: 0.975,
          },
        },
        {
          account_sid: "AC_CLIENT_2002",
          business_username: "imhold",
          name: "I&M Holdings",
          type: "CLIENT",
          status: "active",
          parent_reseller_sid: "AC_RESELLER_1001",
          created_at: "2025-01-18T11:20:00Z",

          staff: [
            { id: "STF004", name: "Claudine N", role: "Boss", email: "claudine@imhold.rw" },
            { id: "STF005", name: "David M", role: "Finance", email: "david.m@imhold.rw" },
          ],

          billing: {
            wallet_balance: 90.0,
            credit_limit: 200,
            currency: "USD",
          },

          sms_usage: {
            this_month_outbound: 15000,
            today_outbound: 500,
            success_rate: 0.993,
          },
        },
      ],
    },
  ],

  // ------------------------------------------------------
  // SMS MESSAGES
  // ------------------------------------------------------
  messages: [
    {
      sid: "SM0001",
      business_sid: "AC_CLIENT_2001",
      reseller_sid: "AC_RESELLER_1001",
      direction: "outbound",
      from: "KCB-ALERT",
      to: "+250788000111",
      status: "delivered",
      error_code: null,
      price: 0.018,
      currency: "USD",
      gateway: "jasmin-primary",
      created_at: "2025-02-02T09:10:00Z",
      delivered_at: "2025-02-02T09:10:01Z",
    },
    {
      sid: "SM0002",
      business_sid: "AC_CLIENT_2002",
      reseller_sid: "AC_RESELLER_1001",
      direction: "outbound",
      from: "IM-BANK",
      to: "+250788000222",
      status: "failed",
      error_code: "ROUTE_UNAVAILABLE",
      price: 0.0,
      currency: "USD",
      gateway: "backup-provider",
      created_at: "2025-02-02T09:11:00Z",
    },
  ],

  // ------------------------------------------------------
  // BILLING
  // ------------------------------------------------------
  billing: {
    wallets: [
      {
        sid: "WL_RESELLER_1001",
        business_sid: "AC_RESELLER_1001",
        balance: 1200.5,
        currency: "USD",
        credit_limit: 5000,
      },
    ],
    transactions: [
      {
        sid: "TX0001",
        business_sid: "AC_RESELLER_1001",
        type: "TOPUP",
        amount: 1000.0,
        currency: "USD",
        reference: "INV-2025-0001",
        created_at: "2025-02-01T09:00:00Z",
      },
      {
        sid: "TX0002",
        business_sid: "AC_RESELLER_1001",
        type: "SMS_DEBIT",
        amount: -150.25,
        currency: "USD",
        details: {
          messages: 8500,
          price_per_sms: 0.018,
        },
        created_at: "2025-02-01T12:30:00Z",
      },
    ],
  },

  // ------------------------------------------------------
  // ROUTING
  // ------------------------------------------------------
  routing: {
    connectors: [
      {
        sid: "CON_JASMIN_01",
        type: "SMPP",
        name: "Primary Jasmin SMPP",
        host: "jasmin.wecall.internal",
        port: 2775,
        bind_type: "TRX",
        status: "up",
        latency_ms: 700,
        throughput_tps: 150,
      },
      {
        sid: "CON_BACKUP_01",
        type: "HTTP",
        name: "Backup Provider API",
        host: "backup.gateway.api",
        status: "up",
      },
    ],

    routes: [
      {
        sid: "ROUTE_RWANDA_01",
        name: "Rwanda Default",
        country: "Rwanda",
        mccmnc: ["63510", "63513"],
        primary_connector_sid: "CON_JASMIN_01",
        backup_connector_sid: "CON_BACKUP_01",
        status: "active",
      },
    ],
  },

  // ------------------------------------------------------
  // EVENT LOGS (OBSERVABILITY)
  // ------------------------------------------------------
  observability: {
    events: [
      {
        sid: "EVT001",
        type: "AUDIT",
        action: "LOGIN_SUCCESS",
        actor: "reseller_admin",
        ip: "41.74.123.10",
        timestamp: "2025-02-02T08:59:50Z",
      },
      {
        sid: "EVT002",
        type: "DLR",
        message_sid: "SM0001",
        status: "delivered",
        connector_sid: "CON_JASMIN_01",
        timestamp: "2025-02-02T09:10:01Z",
      },
    ],
  },
};

