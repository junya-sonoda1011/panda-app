export const classValidatorMessages = {
  isNotEmpty: '$property は入力必須項目です',
  isString: '$property はstring を入力してください',
  isNotExist(message) {
    const regex = /should not exist/;

    // property $property should not exist と一致するメッセージが含まれるか確認する
    const foundMessage = message.find((m) => m.match(regex));

    if (foundMessage) {
      // 日本語に変換する
      message[message.indexOf(foundMessage)] = foundMessage
        .replace(regex, 'という項目は存在しません')
        .slice(9, foundMessage.length);
      return message;
    }
    return;
  },
};
