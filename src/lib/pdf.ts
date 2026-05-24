import { renderToBuffer } from "@react-pdf/renderer";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { createElement } from "react";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fdfcf8",
    padding: 0,
    fontFamily: "Helvetica",
  },
  border: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    bottom: 20,
    borderWidth: 1,
    borderColor: "#C9A96E",
    borderStyle: "solid",
  },
  innerBorder: {
    position: "absolute",
    top: 28,
    left: 28,
    right: 28,
    bottom: 28,
    borderWidth: 0.5,
    borderColor: "#E8D5B0",
    borderStyle: "solid",
  },
  content: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 60,
    paddingBottom: 60,
    alignItems: "center",
  },
  ornamentText: {
    fontSize: 20,
    color: "#C9A96E",
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: 6,
  },
  labelSmall: {
    fontSize: 8,
    color: "#AAAAAA",
    letterSpacing: 2,
    textAlign: "center",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  mainTitle: {
    fontSize: 20,
    color: "#8B1A1A",
    textAlign: "center",
    letterSpacing: 1,
    marginBottom: 4,
    fontFamily: "Helvetica-Bold",
  },
  chineseText: {
    fontSize: 10,
    color: "#AAAAAA",
    textAlign: "center",
    letterSpacing: 3,
    marginBottom: 36,
  },
  divider: {
    width: 100,
    height: 1,
    backgroundColor: "#C9A96E",
    marginVertical: 16,
    opacity: 0.5,
  },
  inviteLabel: {
    fontSize: 8,
    color: "#999999",
    letterSpacing: 2,
    textTransform: "uppercase",
    textAlign: "center",
    marginBottom: 6,
  },
  nameText: {
    fontSize: 24,
    color: "#1A1A1A",
    textAlign: "center",
    letterSpacing: 1,
    marginBottom: 8,
    fontFamily: "Helvetica-Bold",
  },
  idBoxOuter: {
    borderWidth: 1,
    borderColor: "#E8D5B0",
    borderStyle: "solid",
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 8,
    alignItems: "center",
  },
  idBoxLabel: {
    fontSize: 7,
    color: "#AAAAAA",
    letterSpacing: 3,
    textAlign: "center",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  idBoxValue: {
    fontSize: 14,
    color: "#8B1A1A",
    textAlign: "center",
    letterSpacing: 3,
    fontFamily: "Helvetica-Bold",
  },
  eventSection: {
    marginTop: 24,
    alignItems: "center",
    width: "100%",
  },
  eventLabel: {
    fontSize: 7,
    color: "#AAAAAA",
    letterSpacing: 2,
    textAlign: "center",
    marginBottom: 3,
  },
  eventValue: {
    fontSize: 11,
    color: "#333333",
    textAlign: "center",
    letterSpacing: 1,
    marginBottom: 8,
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 60,
    right: 60,
    alignItems: "center",
  },
  footerText: {
    fontSize: 7,
    color: "#CCCCCC",
    letterSpacing: 2,
    textAlign: "center",
    textTransform: "uppercase",
  },
  cornerTL: {
    position: "absolute",
    top: 33,
    left: 33,
    width: 16,
    height: 16,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: "#C9A96E",
    borderStyle: "solid",
  },
  cornerTR: {
    position: "absolute",
    top: 33,
    right: 33,
    width: 16,
    height: 16,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderColor: "#C9A96E",
    borderStyle: "solid",
  },
  cornerBL: {
    position: "absolute",
    bottom: 33,
    left: 33,
    width: 16,
    height: 16,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderColor: "#C9A96E",
    borderStyle: "solid",
  },
  cornerBR: {
    position: "absolute",
    bottom: 33,
    right: 33,
    width: 16,
    height: 16,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: "#C9A96E",
    borderStyle: "solid",
  },
});

interface InvitationData {
  fullName: string;
  translatorId: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  invitationNumber: string;
}

function InvitationDoc({ data }: { data: InvitationData }) {
  return createElement(
    Document,
    {},
    createElement(
      Page,
      { size: "A5", style: styles.page },
      createElement(View, { style: styles.border }),
      createElement(View, { style: styles.innerBorder }),
      createElement(View, { style: styles.cornerTL }),
      createElement(View, { style: styles.cornerTR }),
      createElement(View, { style: styles.cornerBL }),
      createElement(View, { style: styles.cornerBR }),
      createElement(
        View,
        { style: styles.content },
        createElement(Text, { style: styles.ornamentText }, "- * -"),
        createElement(Text, { style: styles.labelSmall }, "INVITATION OFFICIELLE"),
        createElement(Text, { style: styles.mainTitle }, data.eventTitle),
        createElement(Text, { style: styles.chineseText }, "中文译者年会"),
        createElement(View, { style: styles.divider }),
        createElement(Text, { style: styles.inviteLabel }, "Invitation adressée à"),
        createElement(Text, { style: styles.nameText }, data.fullName),
        createElement(
          View,
          { style: styles.idBoxOuter },
          createElement(Text, { style: styles.idBoxLabel }, "Matricule de traducteur"),
          createElement(Text, { style: styles.idBoxValue }, data.translatorId)
        ),
        createElement(View, { style: styles.divider }),
        createElement(
          View,
          { style: styles.eventSection },
          createElement(Text, { style: styles.eventLabel }, "Date de l'événement"),
          createElement(Text, { style: styles.eventValue }, data.eventDate),
          createElement(Text, { style: styles.eventLabel }, "Lieu"),
          createElement(Text, { style: styles.eventValue }, data.eventLocation),
          createElement(Text, { style: styles.eventLabel }, "N° d'invitation"),
          createElement(Text, { style: styles.eventValue }, data.invitationNumber)
        )
      ),
      createElement(
        View,
        { style: styles.footer },
        createElement(
          Text,
          { style: styles.footerText },
          "Cette invitation est strictement nominative et non transférable"
        ),
        createElement(
          Text,
          { style: { ...styles.footerText, marginTop: 4 } },
          "billetdinvitation.site"
        )
      )
    )
  );
}

export async function generateInvitationPDF(data: InvitationData): Promise<Buffer> {
  const docElement = createElement(InvitationDoc, { data });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buffer = await renderToBuffer(docElement as any);
  return Buffer.from(buffer);
}
