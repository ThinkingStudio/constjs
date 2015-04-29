var assert = require('assert');
var should = require('should');
var JSON = require('JSON');
var ConstJs = require('../TESTSRC');


describe('genEnum', function() {

  var MyEnum;

  beforeEach(function() {
    MyEnum = ConstJs.enum('Key1 Key2');
  });

  describe('#_id', function() {
    it('should generate _id field for Enum keys', function() {
      assert.equal('Key1', MyEnum.Key1._id);
      assert.equal('Key2', MyEnum.Key2._id);
    });
  });

  describe('#name()', function() {
    it('should print _id in name() call on Enum keys', function() {
      assert.equal('Key1', MyEnum.Key1.name());
      assert.equal('Key2', MyEnum.Key2.name());
    });
  });

  describe('#toString()', function() {
    it('should print _id in toString() call on Enum keys', function() {
      assert.equal('Key1', MyEnum.Key1.toString());
      assert.equal('Key2', MyEnum.Key2.toString());
    });
  });

  describe('#isXxx()', function() {
    it('should generate a permutation of isXxx() functions for each Enum key', function() {
      assert.equal(true, MyEnum.Key1.isKey1());
      assert.equal(false, MyEnum.Key1.isKey2());
      assert.equal(false, MyEnum.Key2.isKey1());
      assert.equal(true, MyEnum.Key2.isKey2());
    });
  });

  describe('#is()', function() {
    it('should generate is() function that accept Enum, string or int (the sequence) as parameter', function() {
      assert.equal(true, MyEnum.Key1.is(MyEnum.Key1));
      assert.equal(true, MyEnum.Key1.is("key1"));
      assert.equal(true, MyEnum.Key1.is(0));
      assert.equal(true, MyEnum.Key2.is(MyEnum.Key2));
      assert.equal(true, MyEnum.Key2.is("KEY2"));
      assert.equal(true, MyEnum.Key2.is(1));
    });
  });

  describe('#CamelCase', function() {
    it('should transform words into CamelCase for isXxx function on Enum keys', function() {
      var Foo = ConstJs.enum('SIGN_IN, SIGN_UP');
      Foo.SIGN_UP.should.have.property('isSignUp').type('function');
      Foo.SIGN_UP.should.have.property('isSignIn').type('function');
      Foo.SIGN_UP.should.not.have.property('isSIGN_IN');
    });
  });

  describe('immutability', function() {
    it('shall not change the Enum object once it\'s been generated', function() {
      MyEnum.Key1 = 'key1';
      assert.notEqual('key1', MyEnum.Key1);
      assert.equal('Key1', MyEnum.Key1._id);

      MyEnum.Key3 = 'Key3';
      MyEnum.should.not.have.property('Key3');

      delete MyEnum.Key2;
      MyEnum.should.have.property('Key2');
    });
  });

  describe('input variations', function() {
    it('should be able to specify enum keys by other separator', function() {
      var Foo = ConstJs.enum('Foo,Bar;Zee:Tuu');
      Foo.should.have.property('Foo').Object;
      Foo.should.have.property('Bar').Object;
      Foo.should.have.property('Zee').Object;
      Foo.should.have.property('Tuu').Object;
    });

    it('should be able to specify enum keys by String array', function() {
      var Foo = ConstJs.enum(['Foo', 'Bar']);
      Foo.should.have.property('Foo').Object;
      Foo.should.have.property('Bar').Object;
    });

    it('should be able to specify enum keys by Object', function() {
      var Foo = ConstJs.enum({
        Foo: null,
        Bar: null
      });
      Foo.should.have.property('Foo').Object;
      Foo.should.have.property('Bar').Object;
    });

    it('should be able to specify enum keys by argument array', function() {
      var Foo = ConstJs.enum('Foo', 'Bar');
      Foo.should.have.property('Foo').Object;
      Foo.should.have.property('Bar').Object;
    });

  });

  describe('invalid inputs', function() {

    it('should throw exception if input is a number', function() {
      assert.throws(function() {ConstJs.enum(5);}, 'Argument must be a string or an array of strings.');
    });

    it('should throw exception if input array contains element that is not a string', function() {
      assert.throws(function() {ConstJs.enum(['Foo', 5]);}, 'bad enum key: 5');
      assert.throws(function() {ConstJs.enum(['Foo', false]);}, 'bad enum key: 5');
    });

    it('should throw excpetion if key string is not a valid enum key name', function() {
      assert.throws(function() {ConstJs.enum('Foo 5');}, 'bad enum key: 5');
    });

  });

  describe('JSON Serialize/Deserialize', function() {
    it('should be working after JSON serialize', function() {
      var o = {
        flag: MyEnum.Key1,
        name: 'foo'
      }
      var s = JSON.stringify(o);
      //o = JSON.parse(s);
      o = ConstJs.unJSON(s);
      var Key1 = o.flag;

      assert.equal('Key1', Key1._id);
      assert.equal('Key1', Key1.name());
      assert.equal('Key1', Key1.toString());
      assert.equal(true, Key1.isKey1());
      assert.equal(false, Key1.isKey2());
    })

  })

});

describe('genConst', function() {
  
  var MyConst;

  beforeEach(function() {
    MyConst = ConstJs.const("Key1 Key2");
  });

  describe('#const', function() {
    it('should generate constants with value matches keys', function() {
      assert.equal('Key1', MyConst.Key1);
      assert.equal('Key2', MyConst.Key2);
    })
  });

  describe('immutability', function() {
    it('shall not change constants once it is generated', function() {
      MyConst.Key1 = 'ABC';
      assert.notEqual('ABC', MyConst.Key1);
      assert.equal('Key1', MyConst.Key1);

      MyConst.Key3 = 'Key3';
      MyConst.should.not.have.property('Key3');

      delete MyConst.Key2;
      MyConst.should.have.property('Key2');
    });
  });

});

describe('Bitmap', function() {
  
  var MyBitmap;

  beforeEach(function() {
    MyBitmap = ConstJs.bitmap('Key1, Key2');
  });

  describe('#bitmap', function() {
    it('should create bitmap with value default to false', function() {
      assert.equal(false, MyBitmap.Key1);
      assert.equal(false, MyBitmap.Key2);
    });
  });

  describe(': default value: ', function() {

    it('should create bitmap with value equals to the default value', function() {
      var Bitmap = ConstJs.bitmap(true, 'Key1, Key2');
      assert.equal(true, Bitmap.Key1);
      assert.equal(true, Bitmap.Key2);
    });


    it('the default value shall not override specified value if type is boolean', function() {
      var Bitmap = ConstJs.bitmap(true, {
        Key1: false,
        Key2: true
      });
      assert.equal(false, Bitmap.Key1);
      assert.equal(true, Bitmap.Key2);
    });

    it('the default value shall override specified value if type is not boolean', function() {
      var Bitmap = ConstJs.bitmap(true, {
        Key1: 0,
        Key2: 1
      });
      assert.equal(true, Bitmap.Key1);
      assert.equal(true, Bitmap.Key2);
    });

    it('shall not allow extend the bitmap after it is created', function() {
      var Bitmap = ConstJs.bitmap('F1, F2');
      Bitmap.F3 = false;
      Bitmap.should.not.have.property('F3');
    });

    it('shall allow set the bitmap after it is created', function() {
      var Bitmap = ConstJs.bitmap('F1, F2');
      assert(!Bitmap.F1);
      Bitmap.F1 = true;
      assert(Bitmap.F1);
    });

    it('shall NOT allow set the bitmap after it is created with immutable function', function() {
      var Bitmap = ConstJs.bitmap.immutable('F1, F2');
      assert(!Bitmap.F1);
      Bitmap.F1 = true;
      assert(!Bitmap.F1);
    });
    
  });

})