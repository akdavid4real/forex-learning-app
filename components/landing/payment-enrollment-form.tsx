import { Check, LockKeyhole, MessageCircle, Send } from "lucide-react-native";
import { useState } from "react";
import { Linking, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { colors } from "../../src/theme";
import { paymentDetails } from "./payment-details";

type PaymentEnrollmentFormProps = {
  onPaymentSubmitted: () => void;
};

export function PaymentEnrollmentForm({ onPaymentSubmitted }: PaymentEnrollmentFormProps) {
  const [email, setEmail] = useState("");
  const [paymentReference, setPaymentReference] = useState("");
  const [hasConfirmedProof, setHasConfirmedProof] = useState(false);
  const hasRequiredDetails = Boolean(email.trim() && paymentReference.trim());

  const paymentProofMessage = [
    "Hello Forex Learning, I have made my training payment.",
    `Email: ${email.trim() || "Add your registration email"}`,
    `Payment reference: ${paymentReference.trim() || "Add your payment reference"}`,
    "I am attaching my proof of payment for manual verification.",
  ].join("\n");
  const whatsAppNumber = paymentDetails.whatsAppProofNumber.replace(/\D/g, "");
  const whatsAppLink = `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(paymentProofMessage)}`;

  async function openWhatsApp() {
    if (!hasRequiredDetails) return;
    await Linking.openURL(whatsAppLink);
  }

  function confirmProofSent() {
    if (!hasRequiredDetails || hasConfirmedProof) return;
    setHasConfirmedProof(true);
    onPaymentSubmitted();
  }

  return (
    <View style={styles.enrollmentSection}>
      <View style={styles.enrollmentIntro}>
        <Text selectable style={styles.eyebrow}>ENROLLMENT</Text>
        <Text selectable style={styles.sectionTitle}>Complete your enrollment.</Text>
        <Text selectable style={styles.sectionDescription}>
          Use the email address you want connected to your learning account, make the bank transfer, then send your proof on WhatsApp for manual verification.
        </Text>
        <View style={styles.lockNotice}>
          <LockKeyhole color={colors.accent} size={19} strokeWidth={2.2} />
          <Text selectable style={styles.lockNoticeText}>
            Payment is reviewed manually. We never ask for your NIN, password, OTP, or banking PIN.
          </Text>
        </View>
      </View>

      <View style={styles.enrollmentCard}>
        <Text selectable style={styles.formTitle}>Your registration email</Text>
        <Text selectable style={styles.formDescription}>
          This should be the same email you will use when your learner account is activated.
        </Text>
        <FormField
          autoCapitalize="none"
          keyboardType="email-address"
          label="Email address"
          onChangeText={setEmail}
          placeholder="you@example.com"
          value={email}
        />

        <View style={styles.divider} />
        <Text selectable style={styles.formTitle}>Make your payment</Text>
        <Text selectable style={styles.paymentNote}>
          Transfer to the account below, enter the transfer reference, then send your proof to the official WhatsApp number shown here.
        </Text>
        <View style={styles.accountDetails}>
          <PaymentDetail label="Bank" value={paymentDetails.bankName} />
          <PaymentDetail label="Account name" value={paymentDetails.accountName} />
          <PaymentDetail label="Account number" value={paymentDetails.accountNumber} />
        </View>
        <FormField
          label="Payment reference"
          onChangeText={setPaymentReference}
          placeholder="Enter your transfer reference"
          value={paymentReference}
        />

        <Pressable
          accessibilityLabel="Send proof of payment through WhatsApp"
          disabled={!hasRequiredDetails}
          onPress={() => void openWhatsApp()}
          style={[styles.proofButton, !hasRequiredDetails && styles.disabledButton]}
        >
          <MessageCircle color={colors.background} size={19} strokeWidth={2.4} />
          <Text style={styles.proofButtonText}>Open WhatsApp to send proof</Text>
        </Pressable>
        <Text selectable style={styles.whatsAppNumber}>
          Official payment proof number: {paymentDetails.whatsAppProofNumber}
        </Text>

        <Pressable
          disabled={!hasRequiredDetails || hasConfirmedProof}
          onPress={confirmProofSent}
          style={[styles.submitButton, (!hasRequiredDetails || hasConfirmedProof) && styles.disabledButton]}
        >
          {hasConfirmedProof ? <Check color={colors.background} size={20} strokeWidth={2.6} /> : <Send color={colors.background} size={19} strokeWidth={2.3} />}
          <Text style={styles.submitButtonText}>
            {hasConfirmedProof ? "Proof marked as sent" : "I have sent my payment proof"}
          </Text>
        </Pressable>
        <Text selectable style={styles.manualNote}>
          This confirmation does not automatically approve payment. Access is released only after the team verifies the transfer.
        </Text>
      </View>
    </View>
  );
}

type FormFieldProps = {
  autoCapitalize?: "none";
  keyboardType?: "default" | "email-address" | "number-pad";
  label: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  value: string;
};

function FormField({ autoCapitalize, keyboardType, label, onChangeText, placeholder, value }: FormFieldProps) {
  return (
    <View style={styles.fieldGroup}>
      <Text selectable style={styles.fieldLabel}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedText}
        style={styles.input}
        value={value}
      />
    </View>
  );
}

function PaymentDetail({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.accountDetail}>
      <Text selectable style={styles.accountLabel}>{label}</Text>
      <Text selectable style={styles.accountValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  enrollmentSection: { gap: 38, paddingHorizontal: 22, paddingVertical: 72, backgroundColor: "#0D1829" },
  enrollmentIntro: { gap: 16, width: "100%", maxWidth: 560, alignSelf: "center" },
  eyebrow: { color: colors.accent, fontSize: 13, fontWeight: "900", letterSpacing: 1.8 },
  sectionTitle: { color: colors.text, fontSize: 34, fontWeight: "800", letterSpacing: -0.9, lineHeight: 41 },
  sectionDescription: { color: colors.mutedText, fontSize: 16, lineHeight: 25 },
  lockNotice: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 7 },
  lockNoticeText: { flex: 1, color: "#F4D68C", fontSize: 14, fontWeight: "700", lineHeight: 21 },
  enrollmentCard: { gap: 16, width: "100%", maxWidth: 560, alignSelf: "center", padding: 24, borderWidth: 1, borderColor: "#2B4262", borderRadius: 22, backgroundColor: colors.surface },
  formTitle: { color: colors.text, fontSize: 20, fontWeight: "800" },
  formDescription: { color: colors.mutedText, fontSize: 14, lineHeight: 21 },
  fieldGroup: { gap: 7 },
  fieldLabel: { color: "#C8D6E8", fontSize: 13, fontWeight: "800" },
  input: { minHeight: 50, paddingHorizontal: 14, borderWidth: 1, borderColor: "#30445F", borderRadius: 10, color: colors.text, fontSize: 15, backgroundColor: "#0B1423" },
  divider: { height: 1, marginVertical: 5, backgroundColor: colors.border },
  paymentNote: { color: colors.mutedText, fontSize: 14, lineHeight: 21 },
  accountDetails: { gap: 11, padding: 16, borderRadius: 12, backgroundColor: "#0B1423" },
  accountDetail: { flexDirection: "row", justifyContent: "space-between", gap: 16 },
  accountLabel: { color: colors.mutedText, fontSize: 13 },
  accountValue: { flex: 1, color: colors.text, fontSize: 13, fontWeight: "700", textAlign: "right" },
  proofButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9, minHeight: 50, borderRadius: 10, backgroundColor: colors.primary },
  proofButtonText: { color: colors.background, fontSize: 14, fontWeight: "800" },
  whatsAppNumber: { color: colors.mutedText, fontSize: 12, textAlign: "center" },
  submitButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9, minHeight: 52, marginTop: 8, borderRadius: 10, backgroundColor: colors.accent },
  disabledButton: { opacity: 0.45 },
  submitButtonText: { color: colors.background, fontSize: 14, fontWeight: "800" },
  manualNote: { color: colors.mutedText, fontSize: 12, lineHeight: 18, textAlign: "center" },
});
