(function ()
{
    'use strict';

    angular.module('app.media')
        .controller('mediaDialogController', mediaDialogController);

  /* controller for media diialog popup */
    /** @ngInject */
    function mediaDialogController($mdDialog, mediaItem)
    {
        var vm = this;

      vm.img = mediaItem;
        // Data
      var dialogData = {
        type         : 'a',
        calendarEvent: 'no',
        start        : '',
        end          : ''
      };
        vm.dialogData = dialogData;
        vm.notifications = ['15 minutes before', '30 minutes before', '1 hour before'];

        // Methods
        vm.saveEvent = saveEvent;
        vm.closeDialog = closeDialog;

        init();

        //////////

        /**
         * Initialize
         */
        function init()
        {
            vm.dialogTitle = (vm.dialogData.type === 'add' ? 'Add Event' : 'Edit Event');

            // Edit
            if ( vm.dialogData.calendarEvent )
            {
                // Clone the calendarEvent object before doing anything
                // to make sure we are not going to brake the Full Calendar
                vm.calendarEvent = angular.copy(vm.dialogData.calendarEvent);

                // Convert moment.js dates to javascript date object
                if ( moment.isMoment(vm.calendarEvent.start) )
                {
                    vm.calendarEvent.start = vm.calendarEvent.start.toDate();
                }

                if ( moment.isMoment(vm.calendarEvent.end) )
                {
                    vm.calendarEvent.end = vm.calendarEvent.end.toDate();
                }
            }
            // Add
            else
            {
                // Convert moment.js dates to javascript date object
                if ( moment.isMoment(vm.dialogData.start) )
                {
                    vm.dialogData.start = vm.dialogData.start.toDate();
                }

                if ( moment.isMoment(vm.dialogData.end) )
                {
                    vm.dialogData.end = vm.dialogData.end.toDate();
                }

                vm.calendarEvent = {
                    start        : vm.dialogData.start,
                    end          : vm.dialogData.end,
                    notifications: []
                };
            }
        }

        function saveEvent()
        {
            var response = {
                type         : vm.dialogData.type,
                calendarEvent: vm.calendarEvent
            };

            $mdDialog.hide(response);
        }

        /**
         * Close the dialog
         */
        function closeDialog()
        {
            $mdDialog.cancel();
        }
    }
})();