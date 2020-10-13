/* eslint-disable no-unused-vars */
// eslint-disable
export default [{
    path: "/login",
    name: "login",
    component: () => import("../components/auth/login"),
    meta: {
      rule: "*"
    }
  },
  {
    path: "/forgot-password",
    name: "forgotPassword",
    component: () => import("../components/auth/forgot-password"),
    meta: {
      rule: "*"
    }
  },
  {
    name: "aboutYou",
    path: "/about-you/:userId",
    component: () => import("../components/auth/about-you"),
    meta: {
      rule: "*"
    }
  },
  {
    name: "resetPassword",
    path: "/reset-password/:token",
    component: () => import("../components/auth/reset-password"),
    meta: {
      rule: "*"
    }
  },
  {
    name: "createPassword",
    path: "/create-password/:token",
    component: () => import("../components/auth/create-password"),
    meta: {
      rule: "*"
    }
  },
  {
    name: "expire-link",
    path: "/expire-link",
    component: () => import("../components/auth/expire-link"),
    meta: {
      rule: "*"
    }
  },
  {
    name: "forgot-password-otp",
    path: "/forgot-password-otp/:token/:mobile?",
    component: () => import("../components/auth/send-otp"),
    meta: {
      rule: "*"
    }
  },
  {
    name: "reset-password-otp",
    path: "/reset-password-send-otp/:token/:mobile?",
    component: () => import("../components/auth/reset-password-send-otp"),
    meta: {
      rule: "*"
    }
  },
  {
    path: "/policy",
    name: "privacy-policy",
    component: () => import("../components/common/privacy-policy"),
    meta: {
      rule: "*"
    }
  },
  {
    path: "/terms-of-use",
    name: "terms-of-use",
    component: () => import("../components/common/terms-of-use"),
    meta: {
      rule: "*"
    }
  },
  {
    name: "clients",
    path: "/clients",
    component: () => import("../components/clients/clients"),
    meta: {
      rule: "*"
    }
  },
  {
    name: "client-list",
    path: "/client-list/:clientId",
    component: () => import("../components/clients/client-list"),
    meta: {
      rule: "*"
    }
  },
  {
    name: "add-new-client-member",
    path: "/:clientId/add-new-client-member/:clientMemberId",
    component: () => import("../components/clients/add-new-client-member"),
    meta: {
      rule: "*"
    }
  },
  {
    name: "add-edit-client-member",
    path: "/:clientId/add-edit-client-member/:clientMemberId",
    component: () => import("../components/clients/add-edit-client-member"),
    meta: {
      rule: "*"
    }
  },
  {
    name: "add-edit-client",
    path: "/add-edit-client/:clientId",
    component: () => import("../components/clients/add-edit-client"),
    meta: {
      rule: "*"
    }
  },
  {
    name: "client-added",
    path: "/client-added",
    component: () => import("../components/clients/client-added"),
    meta: {
      rule: "*"
    }
  },
  {
    name: "studies",
    path: "/studies",
    component: () => import("../components/studies/studies"),
    meta: {
      rule: "*"
    }
  },
  {
    name: "dashboard",
    path: "/studies/:studyId/dashboard",
    component: () => import("../components/dashboard/dashboard"),
    meta: {
      rule: "*"
    }
  },
  {
    name: "preview-page",
    path: "/studies/:studyId/previewpage",
    component: () => import("../components/participantweb/preview-page"),
    meta: {
      rule: "*"
    }
  },
  {
    name: "publish-page",
    path: "/studies/:studyId/publish",
    component: () => import("../components/participantweb/publish-page"),
    meta: {
      rule: "*"
    }
  },
  
  
  {
    path: "/studies/:studyId/vis",
    component: () => import("../components/visualization"),
    meta: {
      rule: "*"
    },
    children: [{
        name: "vis-recruitment",
        path: "recruitment",
        component: () => import("../components/visualization/recruitment"),
        meta: {
          rule: "*"
        },
        // props: true
      },
      {
        name: "vis-econsent",
        path: "econsent",
        component: () => import("../components/visualization/econsent"),
        meta: {
          rule: "*"
        },
        props: true
      },
      {
        name: "vis-participant-status",
        path: "participant-status",
        component: () => import("../components/visualization/participant-status"),
        meta: {
          rule: "*"
        },
        props: true
      },
      {
        name: "vis-withdrawal",
        path: "withdrawal",
        component: () => import("../components/visualization/withdrawal"),
        meta: {
          rule: "*"
        },
        props: true
      },
      {
        name: "vis-participant-completion",
        path: "participant-completion",
        component: () => import("../components/visualization/participant-completion"),
        meta: {
          rule: "*"
        },
        props: true
      },
      {
        name: "vis-participant-compliance",
        path: "participant-compliance",
        component: () => import("../components/visualization/participant-compliance"),
        meta: {
          rule: "*"
        },
        props: true
      },
      {
        name: "vis-datapoints",
        path: "datapoints",
        component: () => import("../components/visualization/datapoints"),
        meta: {
          rule: "*"
        },
        props: true
      },
      {
        name: "vis-data-queries",
        path: "data-queries",
        component: () => import("../components/visualization/data-queries"),
        meta: {
          rule: "*"
        },
        props: true
      },
      {
        name: "vis-compliance",
        path: "compliance",
        component: () => import("../components/visualization/compliance"),
        meta: {
          rule: "*"
        },
        props: true
      },
      {
        name: "vis-enrollment-sum",
        path: "enrollment-sum",
        component: () => import("../components/visualization/enrollment-sum"),
        meta: {
          rule: "*"
        },
        props: true
      },
    ]
  },
  {
    name: "study-details",
    path: "/studies/:studyId/study-details",
    component: () => import("../pages/study-details"),
    meta: {
      rule: "*"
    }
  },
  {
    //name: "telehealth-study-portal",
    path: "/studies/:studyId/telehealth",
    component: () => import("../components/tele-health-sp/tele-health"),
    meta: {
      rule: "*"
    },
    children: [{
        name: "telehealth-appointments",
        path: "",
        component: () => import("../components/tele-health-sp/appointments"),
        meta: {
          rule: "*"
        },
        props: true
      },
      {
        name: "telehealth-availability",
        path: "availability",
        component: () => import("../components/tele-health-sp/availability"),
        meta: {
          rule: "*"
        }
      }
    ]
  },
  {
    name: "research-team",
    path: "/studies/:studyId/research-team",
    component: () => import("../pages/research-team"),
    meta: {
      permission: "auth"
    },
    children: [{
        name: "study-admins",
        path: "",
        component: () => import("../components/research-team/study-admins"),
        meta: {
          permission: "auth"
        },
        props: true
      },
      {
        name: "study-team",
        path: "study-team",
        component: () => import("../components/research-team/study-team"),
        meta: {
          permission: "auth"
        },
        props: true
      },
      {
        name: "research-site",
        path: "research-site",
        component: () => import("../components/research-team/research-site"),
        meta: {
          permission: "auth"
        },
        props: true,
        children: [{
            name: "list-research-site",
            path: "",
            component: () =>
              import("../components/research-team/list-research-site"),
            meta: {
              permission: "auth"
            },
            props: true
          },
          {
            name: "add-research-site",
            path: "create",
            component: () =>
              import("../components/research-team/add-research-site"),
            meta: {
              permission: "auth"
            },
            props: true
          },
          {
            name: "research-site-details",
            path: ":siteId/view",
            component: () =>
              import("../components/research-team/research-site-details"),
            meta: {
              permission: "auth"
            },
            props: true
          },
          {
            name: "add-research-site-documents",
            path: ":siteId/add-research-site-documents",
            component: () =>
              import("../components/research-team/add-research-site-document"),
              meta: {
                permission: "auth"
              },
              props: true
          },
        ]
      }
    ]
  },
  {
    name: "site-team",
    path: "/studies/:studyId/site-team",
    component: () => import("../pages/site-team"),
    meta: {
      permission: "auth"
    },
    children: [{
      name: "site-details",
      path: ":siteId/view",
      component: () =>
        import("../components/research-team/research-site-details"),
      meta: {
        permission: "auth"
      },
      props: true
    }]
  },
  {
    name: "epros-summary",
    path: "/studies/:studyId/study-details/epros/:eproId",
    component: () => import("../components/study-details/view-links/epros.vue"),
    meta: {
      rule: "*"
    }
  },
  {
    name: "edros-summary",
    path: "/studies/:studyId/study-details/edros/:edroId",
    component: () => import("../components/study-details/view-links/edros.vue"),
    meta: {
      rule: "*"
    }
  },
  {
    name: "survey-summary",
    path: "/studies/:studyId/study-details/survey/:surveyId",
    component: () =>
      import("../components/study-details/view-links/surveys.vue"),
    meta: {
      rule: "*"
    }
  },
  {
    name: "data-capture-form",
    path: "/studies/:studyId/data-capture-form",
    component: () => import("../pages/data-capture/data-capture-forms"),
    meta: {
      rule: "*"
    },
    children: [{
        name: "forms-list",
        path: "",
        component: () => import("../components/edc-form/forms-list"),
        meta: {
          rule: "*"
        }
      },
      {
        name: "form-view",
        path: "form-view/:formId",
        component: () => import("../components/edc-form/form-view.vue"),
        meta: {
          rule: "*"
        }
      },
      {
        name: "form-versions",
        path: "form-versions/:formId",
        component: () => import("../components/edc-form/form-versions.vue"),
        meta: {
          rule: "*"
        }
      },
      {
        name: "schedule-form",
        path: "schedule-form",
        component: () => import("../components/edc-form/schedule-form"),
        meta: {
          rule: "*"
        }
      },
      {
        name: "unschedule-forms",
        path: "unschedule-forms/:packetId",
        component: () => import("../components/edc-form/unscheduled-forms"),
        meta: {
          rule: "*"
        }
      }
    ]
  },
  {
    name: "configure-new-form",
    path: "/studies/:studyId/configure-new-form/:formId",
    component: () => import("../components/edc-form/configure-new-form"),
    meta: {
      rule: "*"
    }
  },
  // {
  //   name: 'study-new',
  //   path: '/studies/:studyId/details',
  //   component: () => import('../components/'),
  //   // component: detailsComponent,
  // },
  // {
  //   name: 'study-products',
  //   path: '/studies/:studyId/products',
  //   component: () => import('../components/'),
  //   // component: productsComponent,
  // },
  // {
  //   name: 'study-surveys',
  //   path: '/studies/:studyId/surveys',
  //   component: () => import('../components/'),
  //   // component: studyComponent,
  // },
  // {
  //   name: 'study-build',
  //   path: '/studies/:studyId/build',
  //   component: () => import('../components/'),
  //   // component: buildComponent,
  // },
  // {
  //   name: 'study-review',
  //   path: '/studies/:studyId/review',
  //   component: () => import('../components/'),
  //   // component: reviewComponent,
  // },
  {
    name: "launch",
    path: "/studies/:studyId/launch",
    component: () => import("../components/configurator/launch/launch"),
    meta: {
      rule: "*"
    }
  },
  {
    name: "manage",
    path: "/studies/:studyId/manage",
    component: () => import("../components/configurator/manage/manage"),
    meta: {
      rule: "*"
    }
  },
  // {
  //   name: 'study-configure',
  //   path: '/studies/:studyId/configure',
  //   component: () => import('../components/'),
  //   // component: configureComponent,
  // },
  // {
  //   name: 'activetasks',
  //   path: '/activetasks',
  //   component: () => import('../components/'),
  //   // component: activetasksComponent,
  // },
  {
    name: "invite-admins",
    path: "/invite-admins",
    component: () => import("../components/invite-admins/invite-admins"),
    meta: {
      rule: "*"
    }
  },
  // {
  //   name: 'participantComponent',
  //   path: '/participant',
  //   component: () => import('../components/'),
  //   // component: participantComponent,
  // },
  // {
  //   name: 'home',
  //   path: '/home',
  //   component: () => import('../components/'),
  //   // component: homeComponent,
  // },
  {
    name: "epro-preview",
    path: "/studies/:studyId/epro/:eproId/preview",
    component: () => import("../components/epros/epro-details"),
    meta: {
      rule: "*"
    }
  },
  {
    name: "read-only-questions",
    path: "/read-only-questions",
    component: () => import("../components/common/read-only-questions"),
    meta: {
      rule: "*"
    }
  },
  {
    name: "users",
    path: "/users",
    component: () => import("../components/users/users"),
    meta: {
      rule: "*"
    }
  },
  {
    name: "add-edit-user",
    path: "/users/:userId",
    component: () => import("../components/users/add-edit-user"),
    meta: {
      rule: "*"
    }
  },
  {
    name: "sponsers",
    path: "/sponsers",
    component: () => import("../components/sponsers/sponsers"),
    meta: {
      rule: "*"
    }
  },
  {
    name: "sponsers-list",
    path: "/sponsers-list/:sponserId",
    component: () => import("../components/sponsers/sponsers-list"),
    meta: {
      rule: "*"
    }
  },
  {
    name: "sponser-member-add-edit",
    path: "/sponser-member-add-edit/:sponserId",
    component: () => import("../components/sponsers/sponser-member-add-edit"),
    meta: {
      rule: "*"
    }
  },
  {
    name: "sponser-member-add-new",
    path: "/sponser-member-add-new/:sponserId",
    component: () => import("../components/sponsers/sponser-member-add-new"),
    meta: {
      rule: "*"
    }
  },
  {
    name: "add-edit-sponser",
    path: "/add-edit-sponser/:sponserId",
    component: () => import("../components/sponsers/add-edit-sponser"),
    meta: {
      rule: "*"
    }
  },
  {
    name: "sponser-added",
    path: "/sponser-added",
    component: () => import("../components/sponsers/sponser-added"),
    meta: {
      rule: "*"
    }
  },
  {
    name: "profile",
    path: "/profile/:id",
    component: () => import("../components/profile/profile"),
    meta: {
      rule: "*"
    }
  },
  // -------------------------------------------------
  {
    path: "/studies/:studyId/web",
    component: () => import("../pages/web"),
    meta: {
      rule: "*"
    },
    children: [{
        name: "global",
        path: "global",
        component: () => import("../components/participantweb/global-elements"),
        meta: {
          rule: "*"
        },
        props: true
      },
      {
        name: "homepage",
        path: "homepage",
        component: () => import("../components/participantweb/homepage"),
        meta: {
          rule: "*"
        },
        props: true
      },
      {
        name: "eligibility",
        path: "eligibility",
        component: () => import("../components/participantweb/eligibility"),
        meta: {
          rule: "*"
        },
        props: true
      },
      {
        name: "agreement",
        path: "agreement",
        component: () => import("../components/participantweb/agreement"),
        meta: {
          rule: "*"
        },
        props: true
      },
      {
        name: "register",
        path: "register",
        component: () => import("../components/participantweb/registration"),
        meta: {
          rule: "*"
        },
        props: true
      },
      {
        name: "publish",
        path: "publish",
        component: () => import("../components/participantweb/publish-page"),
        meta: {
          rule: "*"
        },
        props: true
      }
    ]
  },
  {
    path: "/studies/:studyId/participants",
    component: () => import("../pages/study-participants"),
    meta: {
      rule: "*"
    },
    children: [{
        name: "study-participants-list",
        path: "list",
        component: () => import("../components/participants/participants-list"),
        meta: {
          rule: "*"
        },
        props: true
      },
      {
        name: "participant-document",
        path: ":participantId/documents/:documentId",
        component: () =>
          import("../components/participants/documents/participant-document-detail"),
          meta: {
            rule: "*"
          },
          props: true

        },
      {
        name: "participant-document-history",
        path: ":participantId/documents/:documentId",
        component: () =>
          import("../components/participants/documents/document-details-history"),
        meta: {
          rule: "*"
        },
        props: true,
        children: [
          {
            name: "document-details",
            path: "details",
            component: () =>
            import("../components/participants/documents/document-details"),
            meta: {
              rule: "*"
            },
            props: true
          },
          {
            name: "document-history",
            path: "history",
            component: () =>
              import("../components/participants/documents/document-history"),
            meta: {
              rule: "*"
            },
            props: true
          }
        ]
      },
      {
        name: "study-participants-data-dashboard",
        path: "data-dashboard",
        component: () =>
          import("../pages/study-participants/study-participants-data-dashboard"),
        meta: {
          rule: "*"
        },
        props: true
      },
      {
        name: "study-participants-edc-data-dashboard",
        path: "edc-data-dashboard",
        component: () =>
          import("../pages/study-participants/study-participants-edc-data-dashboard"),
        meta: {
          rule: "*"
        },
        props: true
      },
      {
        name: "study-participant-documents",
        path: "study-participant-documents",
        component: () =>
          import("../pages/study-participants/study-participant-documents"),
          meta: {
            rule: "*"
          },
        props: true
      },
      {
        name: "study-participant-messages",
        path: "messages",
        component: () =>
          import("../pages/study-participants/study-participant-messages"),
        meta: {
          rule: "*"
        },
        props: true,
      },
      {
        name: "study-participant-compose-message",
        path: "messages/compose/:composeMessageId",
        component: () => import("../pages/study-participants/study-participant-compose-message"),
        meta: {
          rule: "*"
        },
        props: true
      },
      {
        name: "study-participant-details",
        path: ":participantId",
        component: () =>
          import("../pages/study-participants/study-participant-details"),
        meta: {
          rule: "*"
        },
        props: true
      },
      {
        name: "participant-profile",
        path: ":participantId/participant-profile",
        component: () =>
          import("../pages/study-participants/study-participants-details-new"),
        meta: {
          rule: "*"
        },
        props: true
      },
      {
        name: "study-participant-form",
        path: ":participantId/forms/:formId",
        component: () =>
          import("../pages/study-participants/study-participant-form"),
        meta: {
          rule: "*"
        },
        props: true
      },
      {
        name: "study-participant-activity",
        path: ":participantId/activity/:activityId",
        component: () =>
          import("../pages/study-participants/study-participant-activity"),
        meta: {
          rule: "*"
        },
        props: true
      },
      {
        name: "study-participant-survey",
        path: ":participantId/survey/:surveyId/:surveyDate/:trakerId",
        component: () =>
          import("../pages/study-participants/study-participant-survey"),
        meta: {
          rule: "*"
        },
        props: true
      },
      {
        name: "study-participant-edc",
        path: ":participantId/edcForm/:formId/milestone/:milestone/responseId/:responseId",
        component: () =>
          import("../pages/study-participants/study-participant-edcForm.vue"),
        meta: {
          rule: "*"
        },
        props: true
      },
      {
        name: "study-participant-edc-reskin",
        path: ":participantId/edcForm/:formId/milestone/:milestone/responseId/:responseId/reskin",
        component: () =>
          import("../pages/study-participants/study-participant-edcForm-reskin.vue"),
        meta: {
          rule: "*"
        },
        props: true
      },
      {
        name: "study-participant-edc-unschedule-packets",
        path: ":participantId/edcForm/unscheduled",
        component: () =>
          import("../pages/study-participants/study-participant-edc-unscheduled-packets.vue"),
        meta: {
          rule: "*"
        },
        props: true
      },
      {
        name: "study-participant-edc-unschedule-packets-reskin",
        path: ":participantId/edcForm/unscheduled/reskin",
        component: () =>
          import("../pages/study-participants/study-participant-edc-unscheduled-packets-reskin.vue"),
        meta: {
          rule: "*"
        },
        props: true
      },
      {
        name: "study-participant-edc-unschedule-form",
        path: ":participantId/edcForm/unscheduled/:packetId/:unscheduledPacketResponseId",
        component: () =>
          import("../pages/study-participants/study-participant-edc-unscheduled-forms.vue"),
        meta: {
          rule: "*"
        },
        props: true
      },
      {
        name: "study-participant-edc-unschedule-form-reskin",
        path: ":participantId/edcForm/unscheduled/:packetId/:unscheduledPacketResponseId/reskin",
        component: () =>
          import("../pages/study-participants/study-participant-edc-unscheduled-forms-reskin.vue"),
        meta: {
          rule: "*"
        },
        props: true
      },
      {
        name: "submitted-form",
        path: ":participantId/edcSubmittedForm/:formId/milestone/:milestone/responseId/:responseId",
        component: () => import("../pages/data-capture/edc-submitted-form"),
        meta: {
          rule: "*"
        }
      },
      {
        name: "submitted-form-new",
        path: ":participantId/edcSubmittedForm/:formId/milestone/:milestone/responseId/:responseId/new",
        component: () => import("../pages/data-capture/edc-submitted-form-new"),
        meta: {
          rule: "*"
        }
      },
      {
        name: "submitted-packets-reskin",
        path: ":participantId/edcSubmittedForm/:packetId/responseId/:unscheduledPacketResponseId/reskin",
        component: () =>
          import("../pages/data-capture/edc-submitted-unscheduled-packets-reskin"),
        meta: {
          rule: "*"
        }
      },
      {
        name: "submitted-packets",
        path: ":participantId/edcSubmittedForm/:packetId/responseId/:unscheduledPacketResponseId",
        component: () =>
          import("../pages/data-capture/edc-submitted-unscheduled-packets"),
        meta: {
          rule: "*"
        }
      }
    ]
  },
  {
    name: "add-edit-participant",
    path: "/studies/:studyId/participants/:participantId",
    component: () => import("../components/participants/add-edit-participant"),
    meta: {
      rule: "*"
    }
  },
  {
    name: "verify-participant",
    path: "/studies/:studyId/:token/:email/verify-participant",
    component: () => import("../components/participants/verify-participant"),
    meta: {
      rule: "*"
    }
  },
  {
    name: "verify-participant-v2",
    path: "/studies/:studyId/:token/:email/verify-participant-v2",
    component: () => import("../components/participants/verify-participant-v2"),
    meta: {
      rule: "*"
    }
  },
  {
    name: "participant-reset-password",
    path: "/participant-reset-password/:token/:languageId",
    component: () =>
      import("../components/participants/participant-reset-password"),
    meta: {
      rule: "*"
    }
  },
  {
    name: "study-build-progress",
    path: "/studies/:studyId/study-build-progress",
    component: () => import("../components/configurator/study-build-progress"),
    meta: {
      rule: "*"
    }
  },
  {
    name: "study-design",
    path: "/studies/:studyId/design",
    component: () => import("../components/configurator/design"),
    meta: {
      rule: "*"
    }
  },
  {
    name: "study-customize",
    path: "/studies/:studyId/customize",
    component: () => import("../components/configurator/customize-features"),
    meta: {
      rule: "*"
    },
    children: [{
        name: "features-library",
        path: "library",
        component: () => import("../components/configurator/features-library"),
        meta: {
          rule: "*"
        }
      },
      {
        name: "onboarding",
        path: "onboarding",
        component: () => import("../components/configurator/onboarding"),
        meta: {
          rule: "*"
        }
      },
      {
        name: "branding",
        path: "branding",
        component: () => import("../components/configurator/branding"),
        meta: {
          rule: "*"
        }
      },
      {
        name: "eligibility",
        path: "eligibility",
        component: () => import("../components/configurator/eligibility"),
        meta: {
          rule: "*"
        }
      },
      {
        name: "econsent",
        path: "econsent",
        component: () => import("../components/configurator/econsent"),
        meta: {
          rule: "*"
        }
      },
      {
        name: "multieconsent",
        path: "multieconsent",
        component: () => import("../components/configurator/multieconsent"),
        meta: {
          permission: "auth"
        }
      },
      {
        name: "multieconsent",
        path: "multieconsent",
        component: () => import("../components/configurator/multieconsent"),
        meta: {
          permission: "auth"
        }
      },
      {
        name: "epic-mychart",
        path: "epic-mychart",
        component: () => import("../components/configurator/epic-mychart"),
        meta: {
          rule: "*"
        }
      },
      {
        name: "medical-devices",
        path: "medical-devices",
        component: () => import("../components/configurator/medical-devices"),
        meta: {
          rule: "*"
        }
      },
      {
        name: "wearables",
        path: "wearables",
        component: () => import("../components/configurator/wearables"),
        meta: {
          rule: "*"
        }
      },
      {
        name: "engagement-content",
        path: "engagement-content",
        component: () =>
          import("../components/configurator/engagement-content"),
        meta: {
          rule: "*"
        }
      },
      {
        name: "activity-order",
        path: "activity-order",
        component: () => import("../components/configurator/activity-order"),
        meta: {
          rule: "*"
        }
      },
      {
        name: "tele-health",
        path: "tele-health",
        component: () => import("../components/configurator/tele-health"),
        meta: {
          rule: "*"
        }
      },
      {
        name: "tele-health-v2",
        path: "tele-health-v2",
        component: () => import("../components/configurator/tele-health-v2"),
        meta: {
          rule: "*"
        }
      },
      {
        name: "notifications",
        path: "notifications",
        component: () => import("../components/configurator/notifications"),
        meta: {
          rule: "*"
        }
      },
      {
        name: "registration",
        path: "registration",
        component: () => import("../components/configurator/registration"),
        meta: {
          rule: "*"
        }
      },
      {
        name: "health-data-access",
        path: "health-data-access",
        component: () =>
          import("../components/configurator/health-data-access"),
        meta: {
          rule: "*"
        }
      },
      {
        name: "surveys",
        path: "surveys",
        component: () => import("../components/configurator/surveys"),
        meta: {
          rule: "*"
        }
      },
      {
        name: "survey-details",
        path: "surveys/:surveyId/details",
        component: () => import("../components/survey-builder/survey-details"),
        props: true,
        meta: {
          rule: "*"
        }
      },

      {
        name: "survey-template-details",
        path: "surveys/templates/:surveyId/details",
        component: () => import("../components/survey-builder/survey-details"),
        props: true,
        meta: {
          rule: "*"
        }
      },
      {
        name: "survey-instructions",
        path: "surveys/:surveyId/instructions",
        component: () =>
          import("../components/survey-builder/survey-instructions"),
        meta: {
          rule: "*"
        }
      },
      {
        name: "survey-questions",
        path: "surveys/:surveyId/questions",
        component: () =>
          import("../components/survey-builder/survey-questions"),
        meta: {
          rule: "*"
        }
      },
      {
        name: "survey-review",
        path: "surveys/:surveyId/review",
        component: () => import("../components/survey-builder/survey-review"),
        meta: {
          rule: "*"
        }
      },
      {
        name: "survey-scheduler",
        path: "surveys/:surveyId/scheduler",
        component: () =>
          import("../components/survey-builder/survey-scheduler"),
        meta: {
          rule: "*"
        }
      },
      {
        name: "survey-as-template",
        path: "surveys/:surveyId/mark-as-template",
        component: () =>
          import("../components/survey-builder/survey-as-template"),
        meta: {
          rule: "*"
        }
      },
      {
        name: "survey-add-another",
        path: "surveys/:surveyId/add-another-survey",
        component: () =>
          import("../components/survey-builder/survey-add-another"),
        meta: {
          rule: "*"
        }
      },
      {
        name: "dashboards",
        path: "participant-dashboards",
        component: () =>
          import("../components/configurator/participant-dashboards"),
        meta: {
          rule: "*"
        }
      },
      {
        name: "epros",
        path: "epros",
        component: () => import("../components/configurator/epros"),
        meta: {
          rule: "*"
        }
      },

      {
        name: "epro-create",
        path: "epros/:eproId/create",
        component: () => import("../components/epros/epro-create"),
        props: true,
        meta: {
          rule: "*"
        }
      },
      {
        name: "epro-details",
        path: "epros/:eproId/details",
        component: () => import("../components/epros/epro-details"),
        meta: {
          rule: "*"
        }
      },
      {
        name: "epro-validate",
        path: "epros/:eproId/validate",
        component: () => import("../components/epros/epro-validate"),
        meta: {
          rule: "*"
        }
      },
      {
        name: "epro-scheduler",
        path: "epros/:surveyId/scheduler",
        component: () => import("../components/epros/epro-scheduler"),
        meta: {
          rule: "*"
        }
      },
      {
        name: "epro-add-another",
        path: "epros/:surveyId/add-another-epro",
        component: () => import("../components/epros/epro-add-another"),
        meta: {
          rule: "*"
        }
      },
      {
        name: "epro-create",
        path: "epros/:studyId/epro/create",
        component: () => import("../components/epros/epro-create"),
        meta: {
          rule: "*"
        }
      },        
      {
        name: "edros",
        path: "edros",
        component: () => import("../components/configurator/edros"),
        meta: {
          rule: "*"
        }
      },
      {
        name: "edit-edro",
        path: "edit-edro",
        component: () => import("../components/configurator/edit-edro"),
        meta: {
          rule: "*"
        }
      },
      {
        name: "features-library-final",
        path: "features-library-final",
        component: () =>
          import("../components/configurator/features-library-final"),
        meta: {
          rule: "*"
        }
      }
    ]
  },
  {
    name: "review",
    path: "/studies/:studyId/review",
    component: () => import("../components/configurator/review/review"),
    meta: {
      rule: "*"
    },
    children: [{
        name: "study-summary",
        path: "study-summary",
        component: () =>
          import("../components/configurator/review/study-summary"),
        meta: {
          rule: "*"
        }
      },
      {
        name: "scan",
        path: "scan",
        component: () => import("../components/configurator/review/scan"),
        meta: {
          rule: "*"
        }
      },
      {
        name: "generate-prototype",
        path: "generate-prototype",
        component: () =>
          import("../components/configurator/review/generate-prototype"),
        meta: {
          rule: "*"
        }
      },
      {
        name: "study-approval-confirm",
        path: "study-approval-confirm",
        component: () =>
          import("../components/configurator/review/study-approval-confirm"),
        meta: {
          rule: "*"
        }
      },
      {
        name: "documentation",
        path: "documentation",
        component: () =>
          import("../components/configurator/review/documentation"),
        meta: {
          rule: "*"
        }
      },
      {
        name: "approval",
        path: "approval",
        component: () => import("../components/configurator/review/approval"),
        meta: {
          rule: "*"
        }
      }
    ]
  },
  {
    path: "/",
    redirect: {
      name: "login"
    }
  },
  {
    name: "study-data-export",
    path: "/studies/:studyId/data-export/:token",
    component: () => import("../components/dashboard/download-data-export"),
    meta: {
      rule: "*"
    }
  },
  {
    path: "*",
    component: () => import("../components/errors/page-not-found"),
    meta: {
      rule: "*"
    }
  }
];
