module.exports = function (folderForViews, urlPrefix, router) {
  router.get('/adaptation-to-vehicle/start-a-claim', function (req, res) {

    res.render(`./${folderForViews}/adaptation-to-vehicle/adaptation-to-vehicle`)
  })

  // post - Are you claiming for support in the workplace
  router.post('/adaptation-to-vehicle/adaptation-to-vehicle-answer', function (req, res) {
    const adaptation = req.session.data['adaptation-to-vehicle']

    if (adaptation === 'Yes') {
      res.redirect(`/${urlPrefix}/adaptation-to-vehicle/grant-information`)
    } else if (adaptation === 'No') {
      res.redirect(`/${urlPrefix}/adaptation-to-vehicle/contact-dwp`)
    }
  })

  router.post('/adaptation-to-vehicle/before-you-continue-answer', function (req, res) {
    res.redirect(`/${urlPrefix}/adaptation-to-vehicle/adaptation-description`)
  })

  router.get('/adaptation-to-vehicle/adaptation-description', function (req, res) {

    if (req.query['key']) {
      req.session.data['next-adaptation'] = 'change'

      var match = req.session.data.adaptation.filter(obj => {
        return obj.key == req.query['key']
      })
      req.session.data.adaptation_name = match[0].adaptation_name
      req.session.data.key = match[0].key
      req.session.data.adaptation_day = match[0].day
      req.session.data.adaptation_month = match[0].month
      req.session.data.adaptation_year = match[0].year
    }
    else {
      req.session.data.adaptation_name = ""
      req.session.data.key = null
      req.session.data.adaptation_day = null
      req.session.data.adaptation_month = null
      req.session.data.adaptation_year = null
    }

    res.redirect(`/${urlPrefix}/adaptation-to-vehicle/adaptation-description2`)
  })

  router.get('/adaptation-to-vehicle/adaptation-description2', function (req, res) {
    res.render(`./${folderForViews}/adaptation-to-vehicle/adaptation-description`)
  })

  router.post('/adaptation-to-vehicle/adaptation-description2', function (req, res) {

    if (!req.session.data.adaptation) {
      req.session.data.adaptation = []
    }

    if (req.session.data.key != null) {
      var match = req.session.data.adaptation.filter(obj => {
        return obj.key == req.session.data.key
      })

      if (match[0]) {
        var matchingIndex = req.session.data.adaptation.indexOf(match[0])
        req.session.data.adaptation[matchingIndex] = {
          key: req.session.data.key,
          adaptation_name: req.session.data.adaptation_name,
          day: req.session.data.adaptation_day,
          month: req.session.data.adaptation_month,
          year: req.session.data.adaptation_year
        }
      }
      else {
        req.session.data.adaptation.push({
          key: req.session.data.adaptation.length,
          adaptation_name: req.session.data.adaptation_name,
          day: req.session.data.adaptation_day,
          month: req.session.data.adaptation_month,
          year: req.session.data.adaptation_year
        })
      }
    }
    else {
      req.session.data.adaptation.push({
        key: req.session.data.adaptation.length,
        adaptation_name: req.session.data.adaptation_name,
        day: req.session.data.adaptation_day,
        month: req.session.data.adaptation_month,
        year: req.session.data.adaptation_year
      })
    }

    req.session.data.adaptation_name = ""
    req.session.data.key = null
    req.session.data.adaptation_day = null
    req.session.data.adaptation_month = null
    req.session.data.adaptation_year = null

    if (req.session.data.remove !== undefined) {
      console.log('Remove')
      req.session.data.remove = undefined
      req.session.data.adaptation.splice(req.session.data.remove, 1)
      res.redirect(`/${urlPrefix}/adaptation-to-vehicle/adaptation-description`)
    } else {
      if (req.session.data.action === 'add') {
        console.log('Add')
        console.log(req.session.data)
        req.session.data.adaptation = [...req.session.data.adaptation, {
          adaptation_name: '',
          day: '',
          month: '',
          year: ''
        }]
        res.redirect(`/${urlPrefix}/adaptation-to-vehicle/adaptation-description`)
      } else {
        console.log('Continue')
        res.redirect(`/${urlPrefix}/adaptation-to-vehicle/adaptation-summary`)
      }
    }
  })

  router.get('/adaptation-to-vehicle/adaptation-remove', function (req, res) {

    if (req.query['key']) {
      var match = req.session.data.adaptation.filter(obj => {
        return obj.key == req.query['key']
      })
      req.session.data.adaptation_name = match[0].adaptation_name
      req.session.data.key = match[0].key
      req.session.data.adaptation_day = match[0].day
      req.session.data.adaptation_month = match[0].month
      req.session.data.adaptation_year = match[0].year
    }
    else {
      res.redirect(`/${urlPrefix}/adaptation-to-vehicle/adaptation-summary`)
    }
    res.redirect(`/${urlPrefix}/adaptation-to-vehicle/adaptation-confirm-remove`)
  })

  router.get('/adaptation-to-vehicle/adaptation-confirm-remove', function (req, res) {
    res.render(`./${folderForViews}/adaptation-to-vehicle/adaptation-remove`)
  })

  router.post('/adaptation-to-vehicle/adaptation-confirm-remove', function (req, res) {
    if (req.session.data.delete == "Yes"){
      keyToDelete = req.session.data.key

      var match = req.session.data.adaptation.filter(obj => {
        return obj.key == keyToDelete
      })

      if (match[0]){
        matchingIndex = req.session.data.adaptation.indexOf(match[0])

        req.session.data.adaptation.splice(matchingIndex, 1);

        for (let i = 0; i < req.session.data.adaptation.length; i++) {
          req.session.data.adaptation[i].key = i
        }
      }
    }

    res.redirect(`/${urlPrefix}/adaptation-to-vehicle/adaptation-summary`)
  })

  router.post('/adaptation-to-vehicle/adaptation-summary', function (req, res) {
    console.log(req.session.data.adaptation)
    const checked = req.session.data['contact-confirmed']
    const add_vehicle_adaptation = req.session.data['add-vehicle-adaptation']

    if (add_vehicle_adaptation == "Yes") {
      req.session.data['next-adaptation'] = 'true'
      res.redirect(`/${urlPrefix}/adaptation-to-vehicle/adaptation-description`)
    }
    else if (add_vehicle_adaptation == "No") {
      if (req.session.data.adaptation === undefined || req.session.data.adaptation.length == 0) {
        res.redirect(`/${urlPrefix}/adaptation-to-vehicle/no-hours-entered`)
      } else if (checked) {
        req.session.data['view-claim'] = ''
        res.redirect(`/${urlPrefix}/adaptation-to-vehicle/check-your-answers`)
      } else {
        res.redirect(`/${urlPrefix}/adaptation-to-vehicle/adaptation-cost`)
      }
    }
    else {
      res.redirect(`/${urlPrefix}/adaptation-to-vehicle/adaptation-summary`)
    }


  })

  router.post('/adaptation-to-vehicle/cost-answer', function (req, res) {
    const cost = req.session.data['adaptation-cost']
    const checked = req.session.data['contact-confirmed']

    if (cost === '100') {
      res.redirect(`/${urlPrefix}/adaptation-to-vehicle/employer-contribution`)
    } else if (cost === '2500') {
      res.redirect(`/${urlPrefix}/adaptation-to-vehicle/too-much-claimed`)
    } else if (checked) {
      req.session.data['view-claim'] = ''

      res.redirect(`/${urlPrefix}/adaptation-to-vehicle/check-your-answers`)
    } else {
      res.redirect(`/${urlPrefix}/adaptation-to-vehicle/providing-evidence`)
    }
  })

  router.post('/adaptation-to-vehicle/receipt-upload-more', function (req, res) {
    const anotherReceipt = req.session.data['add-another-receipt']
    const checked = req.session.data['contact-confirmed']

    if (anotherReceipt === 'Yes') {
      // Reset to stop pre-population of previous visit to page
      req.session.data['file-upload'] = null

      res.redirect(`/${urlPrefix}/adaptation-to-vehicle/receipt-upload`)
    } else if (checked) {
      req.session.data['view-claim'] = ''

      res.redirect(`/${urlPrefix}/adaptation-to-vehicle/check-your-answers`)
    } else {
      res.redirect(`/${urlPrefix}/adaptation-to-vehicle/existing-payee-details`)
    }
  })

  router.post('/adaptation-to-vehicle/receipt-upload-add', function (req, res) {
    let allUploads = req.session.data.uploads // This is the running list of files

    const fileToUpload = req.session.data['file-upload'] // User submitted file

    // Stop null pointer
    if (allUploads == null) {
      allUploads = []
    }

    allUploads.push({
      file: fileToUpload
    })

    req.session.data.uploads = allUploads
    res.redirect(`/${urlPrefix}/adaptation-to-vehicle/upload-summary`)
  })

  // Get
  router.get('/adaptation-to-vehicle/remove-receipt-upload', function (req, res) {
    req.session.data['file-receipt-to-remove'] = req.query.removeId
    res.render(`./${folderForViews}/adaptation-to-vehicle/remove-receipt-upload`)
  })

  // post - Remove receipt confirmation
  router.post('/adaptation-to-vehicle/remove-receipt-upload', function (req, res) {
    const allUploads = req.session.data.uploads
    const fileToDelete = req.session.data['file-receipt-to-remove']
    const removeFile = req.session.data['file-upload-remove']

    if (removeFile === 'Yes') {
      allUploads.splice(fileToDelete, 1)
    }
    req.session.data.uploads = allUploads
    req.session.data['file-receipt-to-remove'] = null
    req.session.data['confirm-file-upload-remove'] = null
    res.redirect(`/${urlPrefix}/adaptation-to-vehicle/upload-summary`)
  })

  router.post('/adaptation-to-vehicle/existing-payee-answers', function (req, res) {
    const payee = req.session.data['existing-payee']

    if (payee === 'New') {
      res.redirect(`/${urlPrefix}/adaptation-to-vehicle/new-payee-name`)
    } else {
      res.redirect(`/${urlPrefix}/adaptation-to-vehicle/existing-account-details`)
    }
  })

  router.post('/adaptation-to-vehicle/existing-account-answers', function (req, res) {
    const payee = req.session.data['existing-payee']
    const account = req.session.data['existing-account']

    if (payee === 'New') {
      res.redirect(`/${urlPrefix}/adaptation-to-vehicle/new-payee-name`)
    } else {
      if (payee == "one"){
        req.session.data["new-payee-full-name"] = 'John Doe'
        req.session.data["payee-email"] = 'john.doe@deafactioncharity.com'

        req.session.data["new-payee-address-line-1"] = '100 Gorgie Park Rd'
        req.session.data["new-payee-address-line-2"] = ''
        req.session.data["new-payee-address-town"] = 'Edinburgh'
        req.session.data["new-payee-address-county"] = 'Midlothian'
        req.session.data["new-payee-address-postcode"] = 'EH11 2QL'
      }
      else if (payee == "two"){
        req.session.data["new-payee-full-name"] = 'Jane Green'
        req.session.data["payee-email"] = 'jane.green@bsl-interpreters.com'

        req.session.data["new-payee-address-line-1"] = '25 N Devon Rd'
        req.session.data["new-payee-address-line-2"] = ''
        req.session.data["new-payee-address-town"] = 'Bristol'
        req.session.data["new-payee-address-county"] = 'Avon'
        req.session.data["new-payee-address-postcode"] = 'BS16 2EX'
      }
      else if (payee == "three"){
        req.session.data["new-payee-full-name"] = 'Sanjid Kelly'
        req.session.data["payee-email"] = 'sanjid.kelly@deafactioncharity.com'

        req.session.data["new-payee-address-line-1"] = '5 Crane St'
        req.session.data["new-payee-address-line-2"] = ''
        req.session.data["new-payee-address-town"] = 'Pontypool'
        req.session.data["new-payee-address-county"] = 'Gwent'
        req.session.data["new-payee-address-postcode"] = 'NP4 6LY'
      }

      if (account == "one"){
        req.session.data["sort-code"] = '123456'
        req.session.data["account-number"] = '12345678'
      }
      else if (account == "two"){
        req.session.data["sort-code"] = '123656'
        req.session.data["account-number"] = '12555678'
      }
      else if (account == "three"){
        req.session.data["name-on-the-account"] = 'Doe and Brothers LLP'
        req.session.data["sort-code"] = '654321'
        req.session.data["account-number"] = '00456789'
      }
      else if (account == "four"){
        req.session.data["name-on-the-account"] = 'Sanjid Burns Kelly'
        req.session.data["sort-code"] = '112233'
        req.session.data["account-number"] = '54532222'
      }

      
      req.session.data["roll-number"] = ''
      req.session.data['view-claim'] = ''

      res.redirect(`/${urlPrefix}/adaptation-to-vehicle/check-your-answers`)
    }


  })





}
