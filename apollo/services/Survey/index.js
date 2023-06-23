import { api } from "../api";

class Survey {
  static getAllSurvey = async () => {
    const result = await api.get(`/survey`);
    return result;
  };
}

module.exports = Survey;
