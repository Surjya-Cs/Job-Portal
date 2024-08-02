let Validators = {
  isEmail: function(email) {
    let re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return re.test(String(email).toLowerCase());
  },

  isAlphabetsOnly: function(str) {
    let re = /[a-zA-Z]/;
    return re.test(str);
  },

  isIntegerOnly: function(intgr) {
    let re = /[0-9]/;
    return re.test(intgr);
  },

  isDecimalOnly: function(num) {
    let re = /^(\d+\.?\d*|\.\d+)$/;
    return re.test(num);
  },

  isValidMobileNumber: function(num) {
    let re = /^[0-9]{10}/;
    // let re= /^[0-9]{10}$/;
   // let re= /^\d{3}-\d{3}-\d{4}$/;
    // return re.test(num.toString().replace(/-/g,''));
    return re.test(num);
  },

  isValidYear: function(num) {
    let re =/^[19-20]{2}[0-9]{2}$/;
    return re.test(num);
  },

  isValidZipCode: function(num) {
    let re =/[0-9]{6}/;
    return re.test(num);
  },
  
  isRequired: function(val) {
    return (typeof val !== 'undefined' && val != null && val != 'null' && val != '');
  },

  isNotNull: function(val) {
    return (val != null && val != 'null');
  },

  isCurrency: function(num) {
    let re =/^\d{0,5}(\.[0-9]{1,2})?$/;
    return re.test(num);
  },

  isValidFileFolderName: function(val) {
    let re = /[\w\- ]+$/;
    return re.test(val);
  }

};

module.exports = Validators;