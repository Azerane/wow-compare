function getPlayersFromKey(object, key) {
  const regex = /^(\d)-([^-]*)-(.*)$/;

  if (Object.prototype.hasOwnProperty.call(object, key)) {
    return object[key].map((element) => {
      const regexResult = regex.exec(element);
      if (regexResult.length < 4) return null;
      return {
        role: regexResult[1],
        name: regexResult[2],
        realm: regexResult[3],
      };
    });
  }
  return null;
}

function importPlayersFromJSON(importedString) {
  try {
    const jsonObject = JSON.parse(importedString);
    return {
      error: null,
      players: {
        group: getPlayersFromKey(jsonObject, 'group'),
        queue: getPlayersFromKey(jsonObject, 'queue'),
      },
    };
  } catch (e) {
    return {
      error: e,
      players: null,
    };
  }
}

const wowImportService = {
  importPlayersFromJSON,
};

export default wowImportService;
