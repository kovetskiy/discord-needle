import { ButtonBuilder, ButtonStyle } from "discord.js";
import InteractionContext from "../models/InteractionContext";
import NeedleButton from "../models/NeedleButton";
import NeedleBot from "../NeedleBot";
import ObjectFactory from "../ObjectFactory";
import CommandExecutorService from "../services/CommandExecutorService";

export default class CloseButton extends NeedleButton {
	public readonly customId = "close";
	private readonly commandExecutor: CommandExecutorService;

	constructor(bot: NeedleBot) {
		super(bot);
		this.commandExecutor = ObjectFactory.createCommandExecutorService();
	}

	public getBuilder(text: string): ButtonBuilder {
		return new ButtonBuilder()
			.setCustomId(this.customId)
			.setLabel(text)
			.setStyle(ButtonStyle.Success)
			.setEmoji("1010182198923636797"); // :archive-3.0: // TODO: move all emojis to private server
	}

	public async press(context: InteractionContext): Promise<void> {
		if (!context.isInGuild()) return;

		const closeCommand = this.bot.getCommand(this.customId);
		const { interaction, settings, replyInSecret } = context;
		const { member, channel } = interaction;
		const hasPermission = await closeCommand.hasPermissionToExecuteHere(member, channel);
		if (!hasPermission) {
			return replyInSecret(settings.ErrorInsufficientUserPerms);
		}

		await this.commandExecutor.execute(closeCommand, context);
	}
}
