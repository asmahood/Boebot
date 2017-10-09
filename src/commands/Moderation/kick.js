const Modlog = require("../../lib/structures/Modlog");

exports.run = async (client, msg, [member, ...reason]) => {
  if (member.user.bot) return msg.send("`❌` | I cannot kick other bots.");
  if (!member.kickable) return msg.send("`❌` | I cannot kick this member.");

  const modRole = msg.guild.roles.get(msg.guild.settings.modRole);
  const adminRole = msg.guild.roles.get(msg.guild.settings.adminRole);
  if (!modRole || !adminRole) return msg.send("`❌` | No mod/admin role found.");
  if (member.roles.has(modRole.id) || member.roles.has(adminRole.id)) return msg.send("`❌` | I cannot kick other mods/admins.");

  if (reason.length === 0) reason = await msg.prompt("**Reason?**");
  if (reason === null) return msg.send("`❌` | No response found. Aborting...");

  await member.kick().catch(err => msg.send(`\`❌\` | It seems an error has occured. This shouldn't have happended. Please contact the bot owner.\n\`\`\`${err}\`\`\``));
  new Modlog(client)
    .setType("kick")
    .setMember(member)
    .setMod(msg.member)
    .setReason(Array.isArray(reason) ? reason.join(" ") : reason)
    .send(msg);
  return msg.send("`✅` User successfully kick.");
};

exports.conf = {
  enabled: true,
  runIn: ["text"],
  aliases: [],
  permLevel: 3,
  botPerms: ["KICK_MEMBERS"],
  requiredFuncs: [],
  cooldown: 5,
};

exports.help = {
  name: "kick",
  description: "Kicks members from the guild.",
  usage: "<member:member> [reason:str] [...]",
  usageDelim: " ",
  extendedHelp: "",
};
