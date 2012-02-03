/**
*
*
*   A model that allows has_one and has_many associations
*
*/
(function(){


  Backbone.RailsModel = Backbone.Model.extend({

    /**
    *
    *   @public
    *   @type {Array}
    *
    *   Array of hasMany associations (empty by default)
    *
    */
    hasMany: [],

    /**
    *
    *   @private
    *
    *   Overridden constructor that is called automatically by Backbone
    *
    */
    constructor: function(){
      var self = this;
      Backbone.Model.prototype.constructor.apply(this, arguments);

      _.each(this.hasMany, function(properties, association){
        self[association] = new properties.collection(self.get(association));
        self.unset(association, {silent: true});
      });
    },

    /**
    *
    *   @public
    *   @return {Object} Serialized model with associations
    *
    *   Serialize a model and include all associations
    *
    */
    toJSON: function(){
      var self = this,
          attrs = _.clone(this.attributes);

      _.each(this.hasMany, function(properties, association){
        var associationKey = association + (properties.asNestedAttributes === false ? "" : "_attributes");

        if ( self[association].length ){
          attrs[associationKey] = self[association].toJSON();
        }
      });

      return attrs;
    }

  });

})();