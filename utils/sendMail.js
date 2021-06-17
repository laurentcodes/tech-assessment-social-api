import nodemailer from 'nodemailer';

const sendMail = async (user, title, type, link) => {
	let content;
	var transport = nodemailer.createTransport({
		host: 'smtp.mailtrap.io',
		port: 2525,
		auth: {
			user: '75d43c04d1fff8',
			pass: '2218388a1d9cd0',
		},
	});

	if (type == 'welcome') {
		content = `Hello, ${user.name} you are welcome`;
	} else if (type == 'reset') {
		content = `Hello, ${user.name}, please click this link to reset your password: ${link}`;
	}

	await transport.sendMail({
		from: '"Social Assessment" <test@example.com>',
		to: user.email,
		subject: title,
		text: content,
		html: `<b>${content}</b>`,
	});
};

export default sendMail;
