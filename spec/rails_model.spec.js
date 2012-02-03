/**
*
*
*   Testing the RailsModel
*
*/
describe("RailsModel", function() {
  var book,
      Book,
      Pages = Backbone.RailsNestedAttributesCollection.extend();

  beforeEach(function() {
    Book = Backbone.RailsModel.extend({
      hasMany: {
        pages: {
          collection: Pages
        }
      }
    });

  });

  // since we override the constructor
  it("should behave like a Backbone Model", function() {
    book = new Book();
    expect(book.attributes).toBeDefined();
  });

  describe("hasMany associations", function() {

    describe("empty model", function() {
      beforeEach(function() {
        book = new Book();
      });

      it("should have a pages collection", function() {
        expect(book.pages instanceof Pages).toBeTruthy();
      });

      describe("serialization", function() {
        it("should not contain the books collection", function() {
          // testing both nested attrs and not nested cases
          expect(book.toJSON().pages).toBeUndefined();
          expect(book.toJSON().pages_attributes).toBeUndefined();
        });
      });

    });

    describe("Populated model", function() {
      beforeEach(function() {
        book = new Book({
          pages: [{one:1}, {two:2}]
        });
      });

      it("should have a populated collection", function() {
        expect(book.pages.length).toEqual(2);
        expect(book.pages.at(0).get('one')).toEqual(1);
        expect(book.pages.at(1).get('two')).toEqual(2);
      });

      it("should not have the collection set as attributes", function(){
        expect(book.get('pages')).toBeUndefined();
      });

      describe("serialization", function() {
        describe("using asNestedAttributes", function() {
          it("should have pages_attributes", function() {
            expect(book.toJSON().pages_attributes).toBeDefined();
            expect(book.toJSON().pages_attributes[0].one).toEqual(1);
          });

          it("should not have pages", function() {
            expect(book.toJSON().pages).toBeUndefined();
          });
        });

        describe("not using asNestedAttributes", function() {
          beforeEach(function() {
            Book = Backbone.RailsModel.extend({
              hasMany: {
                pages: {
                  collection: Pages,
                  asNestedAttributes: false
                }
              }
            });

            book = new Book({
              pages: [{one:1}, {two:2}]
            });
          });

          it("should have pages", function(){
            expect(book.toJSON().pages).toBeDefined();
            expect(book.toJSON().pages[0].one).toEqual(1);
          });

          it("should not have pages_attributes", function() {
            expect(book.toJSON().pages_attributes).toBeUndefined();
          });
        });
      });
    });
  });
});