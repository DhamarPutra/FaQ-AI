const { Client } = require("whatsapp-web.js");
const qrCode = require("qrcode-terminal");
const { Groq } = require("groq-sdk");
const phoneNumber = require("./db/db_user");

const GroqAPI = "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";

const groq = new Groq({
  apiKey: GroqAPI,
  dangerouslyAllowBrowser: true,
  language: "id",
});

const requestGroqAI = async (content) => {
  const response = await groq.chat.completions.create({
    model: "llama3-8b-8192",
    messages: [{ role: "user", content }],
  });
  return "FaQ-AI : " + response.choices[0].message.content;
};

const client = new Client();

client.once("ready", () => {
  console.log("Client is ready!");
});

client.on("qr", (qr) => {
  qrCode.generate(qr, { small: true });
});

// Auto Responder support
client.on("message_create", async (message) => {
  // AI
  if (message.body.startsWith("!ask: ")) {
    const admin = "admin";
    if (phoneNumber(admin, message)) {
      let second = 5;
      console.log(`Loading... ${second}`);
      const interval = setInterval(() => {
        second -= 1;
        console.log(`Loading... ${second}`);
      }, 1000);

      setTimeout(async () => {
        clearInterval(interval);
        try {
          const AI = await requestGroqAI(message.body.slice(6));
          client.sendMessage(message.from, AI);
        } catch (error) {
          console.error("Error fetching AI response:", error);
        }
      }, 5000);
    } else {
      client.sendMessage(
        message.from,
        "Maaf, hanya admin yang dapat menggunakan perintah ini!"
      );
    }
  }

  // Jadwal
  if (message.body === "!jadwal") {
    const data = {
      mata_kuliah: [
        {
          nama: "PEMROGRAMAN 2",
          dosen: {
            nama: "",
            no_tlp: "",
          },
          hari: "",
          tugas_elearning: ["null"],
        },
        {
          nama: "BASIS DATA II",
          dosen: {
            nama: "",
            no_tlp: "",
          },
          hari: "",
          tugas_elearning: ["null"],
        },
        {
          nama: "ARSITEKTUR DAN ORGANISASI",
          dosen: {
            nama: "",
            no_tlp: "",
          },
          hari: "",
          tugas_elearning: ["null"],
        },
        {
          nama: "TEORI BAHASA & AUTOMΑΤΑ",
          dosen: {
            nama: "",
            no_tlp: "",
          },
          hari: "",
          tugas_elearning: ["null"],
        },
        {
          nama: "PRAKTIKUM BASIS DATA",
          dosen: {
            nama: "",
            no_tlp: "",
          },
          hari: "",
          tugas_elearning: ["null"],
        },
        {
          nama: "PEMROGRAMAN WEB 1",
          dosen: {
            nama: "",
            no_tlp: "",
          },
          hari: "",
          tugas_elearning: ["null"],
        },
        {
          nama: "METODE PENELITIAN",
          dosen: {
            nama: "",
            no_tlp: "",
          },
          hari: "",
          tugas_elearning: ["null"],
        },
      ],
    };
    function getMatkul(data) {
      let message = "*Jadwal Mata Kuliah Semester 5*\n\n";
      data.mata_kuliah.forEach((mk) => {
        message += `- ${mk.nama}\n`;
        message += `  Nama Dosen : ${mk.dosen.nama}\n`;
        message += `  No.tlp Dosen : ${mk.dosen.no_tlp}\n`;
        message += `  Hari : ${mk.hari}\n`;
        message += `  *List Tugas Dan E-Learning :*\n`;
        mk.tugas_elearning.forEach((tugas) => {
          message += `  - ${tugas}\n`;
        });
        message += "\n";
      });
      return message;
    }

    const postMatkul = getMatkul(data);
    client.sendMessage(message.from, postMatkul);
  }
});

client.initialize();
