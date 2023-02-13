module.exports = function (folderForViews, urlPrefix, router) {
  router.get('/support-worker-dev/start-a-claim', function (req, res) {

    res.render(`./${folderForViews}/support-worker-dev/start-a-claim`)
  })

  // post - Are you claiming for support in the workplace
  router.post('/support-worker-dev/support-for-workplace-answers', function (req, res) {
    const aids = req.session.data['support-for-workplace']

    if (aids === 'Yes') {
      res.redirect(`/${urlPrefix}/support-worker-dev/grant-information`)
    } else if (aids === 'No') {
      res.redirect(`/${urlPrefix}/support-worker-dev/contact-dwp`)
    }
  })

  // // post - Submit for hours
  // router.post('/support-worker-dev/hours-for-day-summary', function (req, res) {
  //   let allHours = req.session.data.hours // This is the running list of hours
  //
  //   const submittedDay = req.session.data['support[0][day]' || 'support[{{loop.index0}}][day]'] // User submitted day
  //   const submittedHours = req.session.data['support[0][support_hours]' || 'support[{{loop.index0}}][support_hours]'] // User submitted hours worked
  //
  //   // Stop null pointer
  //   if (allHours == null) {
  //     allHours = []
  //   }
  //
  //   allHours.push({
  //     day: submittedDay,
  //     hours: submittedHours
  //   })
  //
  //   req.session.data.hours = allHours
  //   res.redirect(`/${urlPrefix}/support-worker-dev/hours-for-day-summary`)
  // })

  // post - Add more hours
  router.post('/support-worker-dev/hours-for-day-more', function (req, res) {
    const addAnotherDay = req.session.data['add-another-day']
    if (addAnotherDay === 'Yes') {
      // Reset to stop pre-population of previous visit to page
      req.session.data['hours-of-day-date-day'] = null
      req.session.data['hours-of-day-date-month'] = null
      req.session.data['hours-of-day-date-year'] = null
      req.session.data['hours-of-day-worked'] = null

      res.redirect(`/${urlPrefix}/support-worker-dev/hours-for-day`)
    } else if (addAnotherDay === 'No' && (req.session.data.hours === undefined||req.session.data.hours.length == 0)){
      res.redirect(`/${urlPrefix}/support-worker-dev/no-hours-entered`)
    } else {
      res.redirect(`/${urlPrefix}/support-worker-dev/hours-confirmation`)
    }
  })

  // post - Confirm work hours
  router.post('/support-worker-dev/hours-confirm-post', function (req, res) {
    const aids = req.session.data['hours-confirmation']

    if (aids === 'Yes') {
      res.redirect(`/${urlPrefix}/support-worker-dev/cost-of-support`)
    } else if (aids === 'No') {
      res.redirect(`/${urlPrefix}/support-worker-dev/hours-for-day-summary`)
    }
  })

  // post - Add more support hours
  router.post('/support-worker-dev/hours-for-day-summary', function (req, res) {
    console.log(req.session.data.support)
    const month = req.session.data['new-month']
    const journeytype = req.session.data['journey-type']
    const checked = req.session.data['contact-confirmed']

    if (req.session.data.support === undefined || req.session.data.support.length == 0) {
      res.redirect(`/${urlPrefix}/support-worker-dev/no-hours-entered`)
    } else if (month === 'yes') {
      res.redirect(`/${urlPrefix}/support-worker-dev/claiming-for-month-repeat`)
    } else if (month === 'no' && journeytype === 'traveltowork-ammendment') {
      res.redirect(`/${urlPrefix}/support-worker-dev/change-cost`)
    } else if (month === 'no' && checked) {
      res.redirect(`/${urlPrefix}/support-worker-dev/check-your-answers`)
    } else if (month === 'no' && journeytype === 'supportworker') {
      res.redirect(`/${urlPrefix}/support-worker-dev/cost-of-support`)
    }
  })

  router.post('/support-worker-dev/grant-information-answer', function (req, res) {
    res.redirect(`/${urlPrefix}/support-worker-dev/before-you-continue`)
  })

  router.post('/support-worker-dev/before-you-continue-answer', function (req, res) {
    res.redirect(`/${urlPrefix}/support-worker-dev/claiming-for-month`)
  })

  router.post('/support-worker-dev/month-claim-answer', function (req, res) {
    res.redirect(`/${urlPrefix}/support-worker-dev/hours-for-day`)
  })

  router.post('/support-worker-dev/month-claim-answer-repeat', function (req, res) {
    res.redirect(`/${urlPrefix}/support-worker-dev/hours-for-day-repeat`)
  })

  router.post('/support-worker-dev/hours-for-day', function (req, res) {
    console.log(req.session.data.support)
    if (req.session.data.remove !== undefined) {
      console.log('Remove')
      req.session.data.remove = undefined
      req.session.data.support.splice(req.session.data.remove, 1)
      res.redirect(`/${urlPrefix}/support-worker-dev/hours-for-day`)
    } else {
      if (req.session.data.action === 'add') {
        console.log('Add')
        console.log(req.session.data)
        req.session.data.support = [...req.session.data.support, {
          support_hours: '',
          support_minutes: '',
          day: '',
          month: '',
          year: ''
        }]
        res.redirect(`/${urlPrefix}/support-worker-dev/hours-for-day`)
      } else {
        console.log('Continue')
        res.redirect(`/${urlPrefix}/support-worker-dev/hours-for-day-summary`)
      }
    }
  })

  router.post('/support-worker-dev/hours-for-day-repeat', function (req, res) {
    console.log(req.session.data.support)
    if (req.session.data.remove !== undefined) {
      console.log('Remove')
      req.session.data.remove = undefined
      req.session.data.support.splice(req.session.data.remove, 1)
      res.redirect(`/${urlPrefix}/support-worker-dev/hours-for-day-repeat`)
    } else {
      if (req.session.data.action === 'add') {
        console.log('Add')
        console.log(req.session.data)
        req.session.data.support = [...req.session.data.support, {
          support_hours: '',
          support_minutes: '',
          day: '',
          month: '',
          year: ''
        }]
        res.redirect(`/${urlPrefix}/support-worker-dev/hours-for-day-repeat`)
      } else {
        console.log('Continue')
        res.redirect(`/${urlPrefix}/support-worker-dev/hours-for-day-summary`)
      }
    }
  })

  // post - Submit for upload
  router.post('/support-worker-dev/receipt-upload-add', function (req, res) {
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
    res.redirect(`/${urlPrefix}/support-worker-dev/upload-summary`)
  })

  // Get
  router.get('/support-worker-dev/remove-receipt-upload', function (req, res) {
    req.session.data['file-receipt-to-remove'] = req.query.removeId
    res.render(`./${folderForViews}/support-worker-dev/remove-receipt-upload`)
  })

  // post - Remove receipt confirmation
  router.post('/support-worker-dev/remove-receipt-upload', function (req, res) {
    const allUploads = req.session.data.uploads
    const fileToDelete = req.session.data['file-receipt-to-remove']
    const removeFile = req.session.data['file-upload-remove']

    if (removeFile === 'Yes') {
      allUploads.splice(fileToDelete, 1)
    }
    req.session.data.uploads = allUploads
    req.session.data['file-receipt-to-remove'] = null
    req.session.data['confirm-file-upload-remove'] = null
    res.redirect(`/${urlPrefix}/support-worker-dev/upload-summary`)
  })

  // Get
  router.get('/support-worker-dev/remove-day-hours', function (req, res) {
    req.session.data['day-hours-to-remove'] = req.query.removeId
    res.render(`./${folderForViews}/support-worker-dev/remove-day-hours`)
  })

  // post - Remove receipt confirmation
  router.post('/support-worker-dev/remove-day-hours', function (req, res) {
    const allhours = req.session.data.hours
    const hoursToRemove = req.session.data['day-hours-to-remove']
    const removeFile = req.session.data['day-hours-remove-confirmation']

    if (removeFile === 'Yes') {
      allhours.splice(hoursToRemove, 1)
    }
    req.session.data.hours = allhours
    req.session.data['day-hours-to-remove'] = null
    req.session.data['day-hours-remove-confirmation'] = null
    res.redirect(`/${urlPrefix}/support-worker-dev/hours-for-day-summary`)
  })

  // post - Confirm work hours
  router.post('/support-worker-dev/cost-of-support-answer', function (req, res) {
    const cost = req.session.data['cost-of-support']
    const journeytype = req.session.data['journey-type']
    const checked = req.session.data['contact-confirmed']

    if (cost === '100') {
      res.redirect(`/${urlPrefix}/support-worker-dev/employer-contribution`)
    } else if (journeytype === 'traveltowork-ammendment'){
      res.redirect(`/${urlPrefix}/support-worker-dev/upload-summary`)
    } else if (journeytype === 'supportworker' && checked){
      res.redirect(`/${urlPrefix}/support-worker-dev/check-your-answers`)
    } else if (journeytype === 'supportworker'){
      res.redirect(`/${urlPrefix}/support-worker-dev/providing-evidence`)
    }
  })

  router.post('/support-worker-dev/change-cost-answer', function (req, res) {
    const change = req.session.data['change-cost']

    if (change === 'yes') {
      res.redirect(`/${urlPrefix}/support-worker-dev/cost-of-support`)
    } else if (change === 'no'){
      res.redirect(`/${urlPrefix}/travel-to-work/upload-summary`)
    }
  })

  // post - Add more receipts
  router.post('/support-worker-dev/receipt-upload-more', function (req, res) {
    const anotherReceipt = req.session.data['add-another-receipt']
    const journeytype = req.session.data['journey-type']
    const checked = req.session.data['contact-confirmed']

    if (anotherReceipt === 'Yes') {
      // Reset to stop pre-population of previous visit to page
      req.session.data['file-upload'] = null

      res.redirect(`/${urlPrefix}/support-worker-dev/receipt-upload`)
    } else if (journeytype === 'traveltowork-ammendment') {
      res.redirect(`/${urlPrefix}/portal-screens/check-your-answers`)
    } else if (journeytype === 'supportworker' && checked) {
      res.redirect(`/${urlPrefix}/support-worker-dev/check-your-answers`)
    } else if (journeytype === 'supportworker') {
      res.redirect(`/${urlPrefix}/support-worker-dev/guidance-payee-details`)
    }
  })

  // workplace conact answer

  router.post('/support-worker-dev/contact-answers', function (req, res) {
    const journeytype = req.session.data['journey-type']

    if (journeytype === 'supportworker') {
    res.redirect(`/${urlPrefix}/support-worker-dev/check-your-answers`)
  } else if (journeytype === 'traveltowork-ammendment') {
    res.redirect(`/${urlPrefix}/portal-screens/check-your-answers`)
  }
})
}
