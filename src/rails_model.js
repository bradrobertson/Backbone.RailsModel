/**
*
*
*   A model that allows has_one and has_many associations
*
*   Associations are defined in the `class` definition using:
*
*   var Book = Backbone.RailsModel.extend({
*     hasMany: {
*       pages: {
*         collection: Pages
*       },
*       customerReviews: {
*         collection: CustomerReviews
*       }
*     },
*     hasOne: {
*       publishingHouse: {
*         model: PublishingHouse
*       }
*     }
*   });
*
*   Note that we specify our associations using the Javascript camelcased convention
*   The json coming in is expected to use the rails underscored convention however.
*
*   For example, one would populate the above Book object using
*
*   var book = new Book( {customer_reviews: [{one:1}, {two:2}]} )
*
*/
(function(){
  
  var 
      /**
      *
      *   @private
      *   
      *   Trim whitespace from the front and back of a string
      */
      trim = String.prototype.trim || function(){
        return this.replace(/^\s+|\s+$/g, '') ;
      },
      /**
      *
      *   @private
      *   @param {String} string The string to be converted
      *
      *   Convert underscored string into camelcase (taken from undescore.string.js)
      */
      camelize = function(string){
        return trim.call(string).replace(/(\-|_|\s)+(.)?/g, function(match, separator, chr) {
          return chr ? chr.toUpperCase() : '';
        });
      },
      /**
      *
      *   @private
      *   @param {String} string The string to be converted      
      *
      *   Convert camelcased string into underscored (taken from undescore.string.js)
      */
      underscored = function(string){
        return trim.call(string).
          replace(/([A-Z\d]+)([A-Z][a-z])/, '$1_$2').
          replace(/([a-z\d])([A-Z]+)/g, '$1_$2').
          replace(/\-|\s+/g, '_').toLowerCase();
      };


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
        var railsAssociation = underscored(association);
        self[association] = new properties.collection(self.get( railsAssociation ));
        self.unset(railsAssociation, {silent: true});
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
        var associationKey = underscored(association) + (properties.asNestedAttributes === false ? "" : "_attributes");

        if ( self[association].length ){
          attrs[associationKey] = self[association].toJSON();
        }
      });

      return attrs;
    }

  });

})();