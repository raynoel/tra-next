"use strict";
const { parseMultipartData, sanitizeEntity } = require('strapi-utils');
// Documentation pour personnaliser les controleurs
// https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers

// Documentation pour créer des fcts réservées aux propriétaires de l'enrgistrement
// https://strapi.io/documentation/developer-docs/latest/guides/is-owner.html

module.exports = {

  /**
    * Création d'un enregistrement; Ajoute l'auteur dans le champ 'user'
    * @return {Objet}
  */
  async create(ctx) {
    let response;
    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      data.user = ctx.state.user.id;
      response = await strapi.services.events.create(data, { files });
    } else {
      ctx.request.body.user = ctx.state.user.id;
      response = await strapi.services.events.create(ctx.request.body);
    }
    return sanitizeEntity(response, { model: strapi.models.events });
  },


  /**
    * Modifier un enregistrement est réservé à l'auteur
    * @return {Object}
  */
  async update(ctx) {
    const { id } = ctx.params;
    let response;
    const [events] = await strapi.services.events.find({
      id: ctx.params.id,
      'user.id': ctx.state.user.id,
    });
    if (!events) { return ctx.unauthorized(`You can't update this entry`); }
    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      response = await strapi.services.events.update({ id }, data, { files, });
    } else {
      response = await strapi.services.events.update({ id }, ctx.request.body);
    }
    return sanitizeEntity(response, { model: strapi.models.events });
  },


  /**
    * Supprimer l'enregistrement est réservé à l'auteur
    * @return {Object}
  */
   async delete(ctx) {
    const { id } = ctx.params;
    let response;
    const [events] = await strapi.services.events.find({
      id: ctx.params.id,
      'user.id': ctx.state.user.id,
    });
    if (!events) { return ctx.unauthorized(`You can't update this entry`); }
    response = await strapi.services.events.delete({ id });
    return sanitizeEntity(response, { model: strapi.models.events });
  },


  /**
    * Obtient la liste des enregistrements de l'auteur
    * @return Retourne la liste des 'events' ajoutés par l'usagé
  */
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
