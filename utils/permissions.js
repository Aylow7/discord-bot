import { PermissionFlagsBits } from 'discord.js';

export function checkPermissions(member, permissions) {
    if (!member) return false;
    if (member.permissions.has(PermissionFlagsBits.Administrator)) return true;
    return member.permissions.has(permissions);
}

export function checkBotPermissions(guild, permissions) {
    const botMember = guild.members.me;
    if (!botMember) return false;
    return botMember.permissions.has(permissions);
}

export function canModerate(executor, target) {
    if (!executor || !target) return false;
    if (executor.id === target.id) return false;
    if (target.permissions.has(PermissionFlagsBits.Administrator)) return false;
    return executor.roles.highest.position > target.roles.highest.position;
}
