<template>
  <div class="privacy-container pageContainer">
    <el-card class="privacy-card">
      <!-- Header Section -->
      <div class="privacy-header">
        <h1 class="title">{{ privacyContent.title }}</h1>
        <p class="effective-date">Effective Date: April 28, 2025</p>
      </div>

      <!-- Introduction Section -->
      <div class="section introduction-section">
        <p>{{ privacyContent.introduction }}</p>
      </div>

      <!-- Main Content Sections -->
      <div class="content-sections">
        <div
          v-for="(section, index) in privacyContent.sections"
          :key="index"
          class="content-section"
        >
          <h2>{{ section.id }}. {{ section.title }}</h2>

          <template v-if="section.paragraphs">
            <p
              v-for="(para, pIndex) in section.paragraphs"
              :key="`para-${pIndex}`"
            >
              {{ para }}
            </p>
          </template>

          <template v-if="section.lists">
            <ul v-for="(list, lIndex) in section.lists" :key="`list-${lIndex}`">
              <li v-for="(item, iIndex) in list.items" :key="`item-${iIndex}`">
                {{ iIndex + 1 + ". " + item }}
              </li>
            </ul>
          </template>

          <template v-if="section.subsections">
            <div
              v-for="(sub, sIndex) in section.subsections"
              :key="`sub-${sIndex}`"
            >
              <h3>{{ sub.title }}</h3>
              <p>{{ sub.content }}</p>
            </div>
          </template>

          <template v-if="section.link">
            <p>
              To exercise your rights, please contact us at:
              <a class="text-link" :href="`mailto:${section.link}`">{{
                section.link
              }}</a>
            </p>
          </template>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "PrivacyPolicy",
  computed: {
    privacyContent() {
      return {
        title: "JobAce Privacy Policy",
        introduction:
          "At JobAce, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information when you use our platform.",
        sections: [
          {
            id: 1,
            title: "Information We Collect",
            paragraphs: [
              "When you sign up and use our services, we may collect:",
            ],
            subsections: [
              {
                title: "Account Information",
                content:
                  "Your name, email address, and login credentials (including third-party logins like Google)",
              },
              {
                title: "Usage Data",
                content:
                  "Practice session recordings, AI-generated feedback, transcripts, and progress history",
              },
              {
                title: "Technical Data",
                content:
                  "Device type, browser information, microphone access status, and session timestamps",
              },
              {
                title: "Payment Information",
                content:
                  "Payments on JobAce are securely processed through Stripe. We do not store your credit card numbers or billing details on our servers.",
              },
            ],
          },
          {
            id: 2,
            title: "How We Use Your Information",
            paragraphs: ["We use your information to:"],
            lists: [
              {
                items: [
                  "Provide and improve our services",
                  "Personalize your interview practice experience",
                  "Track your performance and progress",
                  "Send important account-related notifications",
                ],
              },
            ],
            paragraphs2: [
              "If you become a paying member, we may also use your name and email address for:",
            ],
            lists2: [
              {
                items: [
                  "Sending JobAce newsletters",
                  "Sharing interview tips, platform updates, and JobAce promotional content",
                ],
              },
            ],
            paragraphs3: [
              'You may opt out of marketing emails at any time by clicking "unsubscribe" in any email footer.',
            ],
          },
          {
            id: 3,
            title: "Data Storage and Security",
            paragraphs: [
              "Your data is securely stored on encrypted servers.",
              "Voice recordings, transcripts, and your practice history are only available to you and are not shared with third parties.",
              "We employ strong security measures, including encryption, secure logins, and restricted access controls, to protect your information.",
            ],
          },
          {
            id: 4,
            title: "Data Sharing",
            paragraphs: [
              "We do not sell, rent, or trade your personal information.",
              "We only share necessary information with trusted service providers who support our operations, such as:",
            ],
            lists: [
              {
                items: [
                  "Stripe (for payment processing)",
                  "Cloud storage providers (for saving your practice data)",
                ],
              },
            ],
            paragraphs2: [
              "These partners are contractually obligated to safeguard your data.",
            ],
          },
          {
            id: 5,
            title: "Your Rights",
            paragraphs: ["You have the right to:"],
            lists: [
              {
                items: [
                  "Access, review, and update your personal information",
                  "Request deletion of your account and associated data",
                ],
              },
            ],
            link: "customerservice@jobace.ca",
          },
          {
            id: 6,
            title: "Cookies and Tracking",
            paragraphs: ["We use cookies and similar technologies to:"],
            lists: [
              {
                items: [
                  "Maintain login sessions",
                  "Improve site performance",
                  "Analyze usage patterns (aggregated and anonymized)",
                ],
              },
            ],
            paragraphs2: [
              "You can adjust your cookie preferences through your browser settings.",
            ],
          },
          {
            id: 7,
            title: "Children's Privacy",
            paragraphs: [
              "JobAce is not intended for children under 16 years old. We do not knowingly collect data from minors.",
            ],
          },
          {
            id: 8,
            title: "Changes to This Policy",
            paragraphs: [
              "We may update this Privacy Policy from time to time. Material changes will be communicated via email or in-app notifications.",
            ],
          },
          {
            id: 9,
            title: "Contact Us",
            paragraphs: [
              "If you have any questions about this Privacy Policy or our practices, please reach out to us:",
            ],
            link: "customerservice@jobace.ca",
          },
        ],
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.privacy-card {
  max-width: 1300px;
  margin: 0 auto;
  padding: 30px;
  margin-bottom: 30px;
}

.privacy-header {
  text-align: center;
  margin-bottom: 30px;

  .title {
    font-size: 28px;
    margin-bottom: 10px;
  }

  .effective-date {
    font-size: 14px;
    opacity: 0.7;
  }
}

.introduction-section {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-base);
}

.content-sections {
  margin-bottom: 20px;
}

.content-section {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-base);

  &:last-child {
    border-bottom: none;
  }

  h2 {
    margin-bottom: 15px;
    font-size: 20px;
  }

  h3 {
    margin: 15px 0 8px 0;
    font-size: 16px;
  }

  ul {
    margin-left: 20px;
    margin-bottom: 15px;

    li {
      margin-bottom: 8px;
      font-weight: 500;
    }
  }

  p {
    margin-bottom: 15px;
  }

  a {
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

@media (max-width: 768px) {
  .privacy-container {
    margin-top: 120px;
    padding: 10px;
  }

  .privacy-card {
    padding: 15px;
  }

  .privacy-header {
    .title {
      font-size: 24px;
    }
  }

  .content-section {
    h2 {
      font-size: 18px;
    }

    h3 {
      font-size: 15px;
    }
  }
}
</style>
