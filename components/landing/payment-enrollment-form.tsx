import {
  Check,
  Copy,
  LockKeyhole,
  MessageCircle,
  Send,
} from "lucide-react-native";
import { useState } from "react";
import {
  Linking,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { colors } from "../../src/theme";
import { paymentDetails } from "./payment-details";

type PaymentEnrollmentFormProps = {
  onPaymentSubmitted: () => void;
};

function createReferralCode() {
  const randomNumber = Math.floor(1000 + Math.random() * 9000);

  return `FL-${randomNumber}`;
}

export function PaymentEnrollmentForm({
  onPaymentSubmitted,
}: PaymentEnrollmentFormProps) {
  const [nin, setNin] = useState("");
  const [email, setEmail] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [paymentReference, setPaymentReference] = useState("");
  const [referralCode] = useState(createReferralCode);
  const [hasSubmittedPayment, setHasSubmittedPayment] = useState(false);
  const hasRequiredDetails = Boolean(
    nin && email && emailCode && paymentReference,
  );
  const paymentProofMessage = [
    "Hello Forex Learning, I have made my payment.",
    `Referral code: ${referralCode}`,
    `Payment reference: ${paymentReference || "Add your payment reference"}`,
    "I am attaching my proof of payment.",
  ].join("\n");
  const whatsAppNumber = paymentDetails.whatsAppProofNumber.replace(/\D/g, "");
  const whatsAppLink = `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(
    paymentProofMessage,
  )}`;

  function handlePaymentSubmission() {
    setHasSubmittedPayment(true);
    onPaymentSubmitted();
  }

  return (
    <View style={styles.enrollmentSection}>
      <View style={styles.enrollmentIntro}>
        <Text selectable style={styles.sectionNumber}>
          04
        </Text>
        <Text selectable style={styles.sectionTitle}>
          Start your registration.
        </Text>
        <Text selectable style={styles.sectionDescription}>
          Complete your details, make your transfer, then send your payment
          proof for approval. Your learning app is released after confirmation.
        </Text>
        <View style={styles.lockNotice}>
          <LockKeyhole color={colors.accent} size={19} strokeWidth={2.2} />
          <Text selectable style={styles.lockNoticeText}>
            Payment approval unlocks your training app.
          </Text>
        </View>
      </View>

      <View style={styles.enrollmentCard}>
        <Text selectable style={styles.formTitle}>
          Your details
        </Text>
        <Text selectable style={styles.formDescription}>
          Use the same email address you want connected to your training app.
        </Text>
        <FormField
          keyboardType="number-pad"
          label="NIN"
          maxLength={11}
          onChangeText={setNin}
          placeholder="Enter your 11-digit NIN"
          value={nin}
        />
        <FormField
          autoCapitalize="none"
          keyboardType="email-address"
          label="Email address"
          onChangeText={setEmail}
          placeholder="you@example.com"
          value={email}
        />
        <Text selectable style={styles.fieldHint}>
          A verification code is sent to this email during registration.
        </Text>
        <FormField
          keyboardType="number-pad"
          label="Email verification code"
          onChangeText={setEmailCode}
          placeholder="Enter the code from your email"
          value={emailCode}
        />
        <View style={styles.referralRow}>
          <View>
            <Text selectable style={styles.fieldLabel}>
              Your referral code
            </Text>
            <Text selectable style={styles.referralCode}>
              {referralCode}
            </Text>
          </View>
          <Copy color={colors.primary} size={19} strokeWidth={2.2} />
        </View>

        <View style={styles.divider} />
        <Text selectable style={styles.formTitle}>
          Make your payment
        </Text>
        <Text selectable style={styles.paymentNote}>
          Transfer to the account below. Add the payment reference, then send
          your proof of payment to the team on WhatsApp.
        </Text>
        <View style={styles.accountDetails}>
          <PaymentDetail label="Bank" value={paymentDetails.bankName} />
          <PaymentDetail
            label="Account name"
            value={paymentDetails.accountName}
          />
          <PaymentDetail
            label="Account number"
            value={paymentDetails.accountNumber}
          />
        </View>
        <FormField
          label="Payment reference"
          onChangeText={setPaymentReference}
          placeholder="Enter your transfer reference"
          value={paymentReference}
        />
        <Pressable
          accessibilityLabel="Send proof of payment through WhatsApp"
          onPress={() => Linking.openURL(whatsAppLink)}
          style={styles.proofButton}
        >
          <MessageCircle
            color={colors.background}
            size={19}
            strokeWidth={2.4}
          />
          <Text style={styles.proofButtonText}>Send proof on WhatsApp</Text>
        </Pressable>
        <Text selectable style={styles.whatsAppNumber}>
          Payment proof number: {paymentDetails.whatsAppProofNumber}
        </Text>
        <Pressable
          disabled={!hasRequiredDetails || hasSubmittedPayment}
          onPress={handlePaymentSubmission}
          style={[
            styles.submitButton,
            (!hasRequiredDetails || hasSubmittedPayment) &&
              styles.disabledButton,
          ]}
        >
          {hasSubmittedPayment ? (
            <Check color={colors.background} size={20} strokeWidth={2.6} />
          ) : (
            <Send color={colors.background} size={19} strokeWidth={2.3} />
          )}
          <Text style={styles.submitButtonText}>
            {hasSubmittedPayment
              ? "Payment submitted for approval"
              : "Submit payment for approval"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

type FormFieldProps = {
  autoCapitalize?: "none";
  keyboardType?: "default" | "email-address" | "number-pad";
  label: string;
  maxLength?: number;
  onChangeText: (value: string) => void;
  placeholder: string;
  value: string;
};

function FormField({
  autoCapitalize,
  keyboardType,
  label,
  maxLength,
  onChangeText,
  placeholder,
  value,
}: FormFieldProps) {
  return (
    <View style={styles.fieldGroup}>
      <Text selectable style={styles.fieldLabel}>
        {label}
      </Text>
      <TextInput
        accessibilityLabel={label}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        maxLength={maxLength}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedText}
        style={styles.input}
        value={value}
      />
    </View>
  );
}

type PaymentDetailProps = {
  label: string;
  value: string;
};

function PaymentDetail({ label, value }: PaymentDetailProps) {
  return (
    <View style={styles.accountDetail}>
      <Text selectable style={styles.accountLabel}>
        {label}
      </Text>
      <Text selectable style={styles.accountValue}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  enrollmentSection: {
    gap: 38,
    paddingHorizontal: 22,
    paddingVertical: 72,
    backgroundColor: "#0D1829",
  },
  enrollmentIntro: {
    gap: 16,
    width: "100%",
    maxWidth: 500,
  },
  sectionNumber: {
    color: colors.accent,
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 2,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: -0.9,
    lineHeight: 41,
  },
  sectionDescription: {
    color: colors.mutedText,
    fontSize: 16,
    lineHeight: 25,
  },
  lockNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 7,
  },
  lockNoticeText: {
    flex: 1,
    color: "#F4D68C",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 21,
  },
  enrollmentCard: {
    gap: 16,
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
    padding: 24,
    borderWidth: 1,
    borderColor: "#2B4262",
    borderRadius: 22,
    backgroundColor: colors.surface,
  },
  formTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "800",
  },
  formDescription: {
    color: colors.mutedText,
    fontSize: 14,
    lineHeight: 21,
  },
  fieldGroup: {
    gap: 7,
  },
  fieldLabel: {
    color: "#C8D6E8",
    fontSize: 13,
    fontWeight: "800",
  },
  fieldHint: {
    color: colors.mutedText,
    marginTop: -9,
    fontSize: 12,
    lineHeight: 18,
  },
  input: {
    minHeight: 50,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#30445F",
    borderRadius: 10,
    color: colors.text,
    fontSize: 15,
    backgroundColor: "#0B1423",
  },
  referralRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
    padding: 14,
    borderWidth: 1,
    borderColor: "#245D5B",
    borderRadius: 10,
    backgroundColor: "#0C2328",
  },
  referralCode: {
    marginTop: 4,
    color: colors.primary,
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    marginVertical: 5,
    backgroundColor: colors.border,
  },
  paymentNote: {
    color: colors.mutedText,
    fontSize: 14,
    lineHeight: 21,
  },
  accountDetails: {
    gap: 11,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#0B1423",
  },
  accountDetail: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  accountLabel: {
    color: colors.mutedText,
    fontSize: 13,
  },
  accountValue: {
    flex: 1,
    color: colors.text,
    fontSize: 13,
    fontWeight: "700",
    textAlign: "right",
  },
  proofButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    minHeight: 50,
    borderRadius: 10,
    backgroundColor: colors.primary,
  },
  proofButtonText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: "800",
  },
  whatsAppNumber: {
    color: colors.mutedText,
    fontSize: 12,
    textAlign: "center",
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    minHeight: 52,
    marginTop: 8,
    borderRadius: 10,
    backgroundColor: colors.accent,
  },
  disabledButton: {
    opacity: 0.45,
  },
  submitButtonText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: "800",
  },
});
