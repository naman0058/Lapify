let categories = []
let subcategories = []


let table = 'model'

$('#show').click(function(){
  
$.getJSON(`${table}/all`, data => {
    subcategories = data
    makeTable(data)
    
  
})

})



$('#type').change(() => {
    const filteredData = categories.filter(item => item.type == $('#type').val())
    fillDropDown('brandid', filteredData, 'Choose Brand', 0)
})


$.getJSON(`category/all`, data => {
    categories = data
    fillDropDown('brandid', [], 'Choose Brand', 0)
  
})


function fillDropDown(id, data, label, selectedid = 0) {
    $(`#${id}`).empty()
    $(`#${id}`).append($('<option>').val("null").text(label))

    $.each(data, (i, item) => {
        if (item.id == selectedid) {
            $(`#${id}`).append($('<option selected>').val(item.id).text(item.name))
        } else {
            $(`#${id}`).append($('<option>').val(item.id).text(item.name))
        }
    })
}



function makeTable(categories){
      let table = ` <div class="table-responsive">

      <button type="button" id="back" class="btn btn-primary" style="margin:20px">BacK</button>
<table id="report-table" class="table table-bordered table-striped mb-0">
<thead>
<tr>
<th>Image</th>
<th>Brand Name</th>
<th>Name</th>
<th>Price</th>
<th>Options</th>
</tr>
</thead>
<tbody>`

$.each(categories,(i,item)=>{
table+=`<tr>
<td>
<img src="/images/${item.image}" class="img-fluid img-radius wid-40" alt="" style="width:50px;height:50px">
</td>
<td>${item.brandname}</td>
<td>${item.name}</td>
<td>${item.price}</td>
<td>
<a href="#!" class="btn btn-info btn-sm edits" id="${item.id}"><i class="feather icon-edit"></i>&nbsp;Edit </a>
<a href="#!" class="btn btn-info btn-sm updateimage"  id="${item.id}"><i class="feather icon-edit"></i>&nbsp;Edit Image </a>
<a href="#!" class="btn btn-danger btn-sm deleted" id="${item.id}"><i class="feather icon-trash-2"></i>&nbsp;Delete </a>
</td>
</tr>`
})
table+=`</tbody>
</table>
</div>

    
  <!-- End Row -->`
      $('#result').html(table)
      $('#insertdiv').hide()
      $('#result').show()
}


$('#result').on('click', '.deleted', function() {
    const id = $(this).attr('id')
     $.get(`${table}/delete`,  { id }, data => {
        refresh()
    })
})



$('#result').on('click', '.edits', function() {
    const id = $(this).attr('id')
    const result = subcategories.find(item => item.id == id);
    fillDropDown('pbrandid', categories, 'Choose Category', result.brandname)
    $('#editdiv').show()
    $('#result').hide()
    $('#insertdiv').hide() 
    $('#pid').val(result.id)
     $('#pname').val(result.name)
     $('#pbrandid').val(result.brandid)
     $('#pprice').val(result.price)
     $('#plaptop_switch_off').val(result.laptop_switch_off)
     $('#ptouchscreen_prize_available').val(result.touchscreen_prize_available)
     $('#pgraphics_card_available').val(result.graphics_card_available)
     $('#pscree_not_working').val(result.scree_not_working)
     $('#pkeyboard_not_working').val(result.keyboard_not_working)
     $('#ptouchpad_not_working').val(result.touchpad_not_working)
     $('#pbattery_dead').val(result.battery_dead)
     $('#pspeaker_not_working').val(result.speaker_not_working)
     $('#pwifi_not_working').val(result.wifi_not_working)
     $('#pwire_cut').val(result.wire_cut)
     $('#pwebcam_not_working').val(result.webcam_not_working)
     $('#page').val(result.age)
     $('#page1').val(result.age1)
     $('#page2').val(result.age2)

     $('#pcondition').val(result.condition)
     $('#pcondition1').val(result.condition1)
     $('#pcondition2').val(result.condition2)
     $('#ptype').val(result.type)

     $('#pcondition3').val(result.condition3)
     $('#ptouchscreen_prize_not_available').val(result.touchscreen_prize_not_avaialble)
     $('#pgraphics_card_not_available').val(result.graphics_card_not_available)
     $('#p10_inch').val(result.s10_inch)
     $('#p12_inch').val(result.s12_inch)
     $('#p13_inch').val(result.s13_inch)
     $('#p14_inch').val(result.s14_inch)
     $('#p15_inch').val(result.s15_inch)






     $('#poriginal_keyword_price').val(result.original_keyword_price)
     $('#poriginal_mouse').val(result.original_mouse)
     $('#poriginal_charger_power').val(result.original_charger_power)
     $('#poriginal_box').val(result.original_box)



   


   
 })



 $('#result').on('click', '.updateimage', function() {
    const id = $(this).attr('id')
    

    const result = subcategories.find(item => item.id == id);
    $('#peid').val(result.id)
})



 
$('#update').click(function(){  //data insert in database
    let updateobj = {
        id: $('#pid').val(),
        name: $('#pname').val(),
        brandid:$('#pbrandid').val(),
        price:$('#pprice').val(),
        laptop_switch_off:$('#plaptop_switch_off').val(),
        touchscreen_prize_available:$('#ptouchscreen_prize_available').val(),
        graphics_card_available:$('#pgraphics_card_available').val(),
        scree_not_working:$('#pscree_not_working').val(),
        keyboard_not_working:$('#pkeyboard_not_working').val(),
        touchpad_not_working:$('#ptouchpad_not_working').val(),
        battery_dead:$('#pbattery_dead').val(),
        speaker_not_working:$('#pspeaker_not_working').val(),
        wifi_not_working:$('#pwifi_not_working').val(),
        wire_cut:$('#pwire_cut').val(),
        webcam_not_working:$('#pwebcam_not_working').val(),
        age:$('#page').val(),
        age1:$('#page1').val(),
        age2:$('#page2').val(),
        type:$('#ptype').val(),
        condition:$('#pcondition').val(),
        condition1:$('#pcondition1').val(),
        condition2:$('#pcondition2').val(),


        touchscreen_prize_not_avaialble:$('#ptouchscreen_prize_not_available').val(),
        graphics_card_not_available:$('#pgraphics_card_not_available').val(),

        s10_inch:$('#p10_inch').val(),
        s12_inch:$('#p12_inch').val(),
        s13_inch:$('#p13_inch').val(),
        s14_inch:$('#p14_inch').val(),
        s15_inch:$('#p15_inch').val(),



        original_keyword_price:$('#poriginal_keyword_price').val(),
        original_mouse:$('#poriginal_mouse').val(),
        original_charger_power:$('#poriginal_charger_power').val(),
        original_box:$('#poriginal_box').val(),
        
       
        }

        console.log(updateobj)

    $.post(`/${table}/update`, updateobj , function(data) {
       update()
    // console.log('res',data)
    })
})






function refresh() 
{
    $.getJSON(`${table}/all`, data => makeTable(data))
}
function update()
{
    $('#result').show()
    $('#editdiv').hide()
    $('#insertdiv').show() 
    refresh()
    refresh()
}

//================================Page Functionality=============================//
$('#editdiv').hide()
$('#updateimagediv').hide()

$('#result').on('click', '#back', function() {
    $('#result').hide()
    $('#insertdiv').show()
})

$('#back1').click(function(){
    $('#result').show()
    $('#insertdiv').hide()
    $('#editdiv').hide()
    $('#updateimagediv').hide()

})

$('#back2').click(function(){
    $('#result').show()
    $('#insertdiv').hide()
    $('#editdiv').hide()
    $('#updateimagediv').hide()
})

$('#result').on('click', '.updateimage', function() {
    $('#updateimagediv').show()
    $('#result').hide()
    $('#insertdiv').hide()
    $('#editdiv').hide()
})


