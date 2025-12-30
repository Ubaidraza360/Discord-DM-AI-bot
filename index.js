async function askGemini(prompt) {
  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDbIsBkS9mGJW5QcFoag8vFAudV7ShMF18`;

  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  // ✅ DEBUG (Railway logs me actual response dekho)
  console.log("Gemini status:", res.status);
  console.log("Gemini response:", JSON.stringify(data));

  // ✅ If error comes from Gemini
  if (!res.ok) {
    return `Gemini error (${res.status}): ${data?.error?.message || "Unknown error"}`;
  }

  // ✅ Extract text safely
  const text =
    data?.candidates?.[0]?.content?.parts?.map(p => p.text).join("\n");

  return text || "Theek hai. Aap ka sawal bata dein.";
}


client.on('ready', () => {
  console.log(`🤖 Bot logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  // ✅ DM only
  if (message.guild) return;

  const userText = message.content?.trim() || "";
  if (!userText) return;

  const reply = await askGemini(userText);
  await message.reply(reply);
});

