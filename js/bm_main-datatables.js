/**
 * Lightweight DataTables bootstrap for BM modules.
 */
(function (Drupal, once) {
  Drupal.behaviors.bmMainDatatables = {
    attach(context) {
      once('bm-main-datatables', 'table[data-bm-help-ai-table]', context).forEach((table) => {
        if (typeof jQuery === 'undefined' || !jQuery.fn.DataTable) {
          return;
        }

        const hasActions = table.hasAttribute('data-has-actions');
        const columnCount = table.querySelectorAll('thead th').length;
        const orderColumns = hasActions ? [3, 0] : [2, 0];

        jQuery(table).DataTable({
          order: orderColumns.map((idx) => [idx, 'asc']),
          pageLength: 25,
          lengthMenu: [10, 25, 50, 100],
          searching: true,
          columnDefs: hasActions ? [
            { targets: [columnCount - 1], orderable: false, searchable: false },
          ] : [],
        });
      });
    },
  };
})(Drupal, once);
