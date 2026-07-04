$("#pesquisa_pedido").on('keyup', function () {
    const valorInput = $(this).val();

    if (!valorInput) {
        $("#table_vendas tbody tr").show();
        return;
    }

    try {
        let regex = new RegExp(valorInput.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

        $('#table_vendas tbody tr').each(function () {
            let textoLinha = $(this).text();

            if (regex.test(textoLinha)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    } catch (e) {
        console.log("Regex incompleto ao inválido...");
    }
});