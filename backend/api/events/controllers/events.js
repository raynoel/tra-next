"use strict";
const { sanitizeEntity } = require("strapi-utils");               // prévient les injection JS

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */
  // Create event with linked user
  // https://strapi.io/documentation/developer-docs/latest/guides/is-owner.html
module.exports = {

  // Retourne la liste des 'events' ajoutés par l'usagé identifié par son token
  async me(context) {
    const user = context.state.user;                                      // Obtient l'usagé identifié par son token
    if (!user) {
      return context.badRequest(null, [
        { messages: [{ id: "No authorization header was found" }] },
      ]);
    }

    const data = await strapi.services.events.find({ user: user.id });    // Obtient la liste des 'events' de l'usagé
    if (!data) { return context.notFound(); }

    return sanitizeEntity(data, { model: strapi.models.events });
  },


};
