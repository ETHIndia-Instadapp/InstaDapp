function popAlert(text) {
    $('.loader').hide();
    $('.modalTop').text('Message');
    $('.modalText').html(text);
    $('.modalCover').show();
}