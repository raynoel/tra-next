"use strict";
const { sanitizeEntity } = require("strapi-utils");               // prévient les injection JS

// Documentation pour personnaliser les controleurs
// https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers

// Documentation pour créer des fcts réservées aux propriétaires de l'enrgistrement
// https://strapi.io/documentation/developer-docs/latest/guides/is-owner.html

module.exports = {

  // Retourne la liste des 'events' ajoutés par l'usagé
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
