/**
*
*
*   Testing the RailsModel
*   See spec_helper.js for model and colleciton defn's
*
*/
describe("RailsModel", function() {
  var book,
      Book;
      
  beforeEach(function(){
    Book = Backbone.RailsModel.extend();
  });

  // since we override the constructor
  it("should behave like a Backbone Model", function() {
    book = new Book();
    expect(book instanceof Backbone.Model).toBeTruthy();
    expect(book.attributes).toBeDefined();
  });

  describe("hasMany associations", function() {
    
    beforeEach(function() {
      Book = Backbone.RailsModel.extend(hasManyNested);
    });

    describe("Empty model", function() {
      beforeEach(function() {
        book = new Book();
      });

      it("should have collections set", function() {
        expect(book.pages instanceof Collections.Pages).toBeTruthy();
        expect(book.customerReviews instanceof Collections.CustomerReviews).toBeTruthy();
      });

      describe("serialization", function() {
        it("should not contain the books and reviews collections", function() {
          expect(book.toJSON().pages_attributes).toBeUndefined();
          expect(book.toJSON().customer_reviews_attributes).toBeUndefined();
        });
        
        describe("asNestedAttributes: false", function(){
          beforeEach(function(){
            Book = Backbone.RailsModel.extend(hasManyNotNested);
            book = new Book();
          });
          
          it("should not contain the books and reviews collection", function() {
            expect(book.toJSON().pages).toBeUndefined();
            expect(book.toJSON().customer_reviews).toBeUndefined();
          });
        });
      });

    });

    describe("Populated model", function() {
      beforeEach(function() {
        book = new Book({
          pages: [{one:1}, {two:2}],
          customer_reviews: [{one:'great'},{two:'mediocre'},{three:'soso'}]
        });
      });

      it("should have a populated each collection", function() {
        expect(book.pages.length).toEqual(2);
        expect(book.pages.at(0).get('one')).toEqual(1);
        expect(book.pages.at(1).get('two')).toEqual(2);

        expect(book.customerReviews.length).toEqual(3);
        expect(book.customerReviews.at(0).get('one')).toEqual('great');
        expect(book.customerReviews.at(1).get('two')).toEqual('mediocre');
        expect(book.customerReviews.at(2).get('three')).toEqual('soso');
      });

      it("should not have the collection set as attributes", function(){
        expect(book.get('pages')).toBeUndefined();
        expect(book.get('customer_reviews')).toBeUndefined();
      });

      describe("serialization", function() {
        it("should have both collection's attributes", function() {
          expect(book.toJSON().pages_attributes).toBeDefined();
          expect(book.toJSON().pages_attributes[0].one).toEqual(1);
          
          expect(book.toJSON().customer_reviews_attributes).toBeDefined();
          expect(book.toJSON().customer_reviews_attributes[0].one).toEqual('great');
        });

        it("should not have pages or customer_reviews", function() {
          expect(book.toJSON().pages).toBeUndefined();
          expect(book.toJSON().customer_reviews).toBeUndefined();
        });

        describe("asNestedAttributes: false", function() {
          beforeEach(function() {
            Book = Backbone.RailsModel.extend(hasManyNotNested);

            book = new Book({
              pages: [{one:1}, {two:2}],
              customer_reviews: [{one:'great'},{two:'mediocre'},{three:'soso'}]
            });
          });

          it("should have pages", function(){
            expect(book.toJSON().pages).toBeDefined();
            expect(book.toJSON().pages[0].one).toEqual(1);
            
            expect(book.toJSON().customer_reviews).toBeDefined();
            expect(book.toJSON().customer_reviews[0].one).toEqual('great');
          });

          it("should not have pages_attributes", function() {
            expect(book.toJSON().pages_attributes).toBeUndefined();
            expect(book.toJSON().customer_reviews_attributes).toBeUndefined();
          });
        });
      });
    });
  });
});