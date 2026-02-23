$(function() {
            $('[data-bs-toggle="tooltip"]').tooltip();
            $('[data-bs-toggle="popover"]').popover();
            
            $('.modal').on('show.bs.modal', function (e) {
                console.log('Modal se esta ejecutando:', this.id);
                // Guardar la referencia del botón en el modal y deshabilitarlo
                const $trigger = $(e.relatedTarget);
                $(this).data('triggerButton', $trigger);
                $trigger.prop('disabled', true).addClass('btn-secondary');
            });
            
            $('.modal').on('shown.bs.modal', function (e) {
                console.log('Modal se ejecutó');
            });
            
            $('.modal').on('hide.bs.modal', function (e) {
                console.log('Modal se esta cerrando');
            });
            
            $('.modal').on('hidden.bs.modal', function (e) {
                console.log('Modal se cerró');
                // Re-habilitar el botón usando la referencia guardada
                const $trigger = $(this).data('triggerButton');
                if ($trigger) {
                    $trigger.prop('disabled', false).removeClass('btn-secondary');
                }
            });
        });