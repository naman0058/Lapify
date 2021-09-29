let categories = []
let subcategories = []


let table = 'accessories'

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


// alert($('#brandid').val())


// $('#brandid').change(() => {

//     alert($('#brandid').val())


// if($('#brandid').val() == '61'){
//     $('#issound').prop( "checked", true );
//     $('#isbluetooth').prop( "unchecked", true );


// }



// if($('#brandid').val() == '57'){
//     $('#isbluetooth').prop( "checked", true );

// }

// })


$.getJSON(`category/all`, data => {
    categories = data
    fillDropDown('brandid', [], 'Choose Brand', 0)
  
})



$.getJSON(`/api/specification?type=ram`, data => {
    ram = data
    fillDropDown1('ram', data, 'Choose Ram', 0)
})



$.getJSON(`/api/specification?type=Processor`, data => {
    processor = data
    fillDropDown1('processor', data, 'Choose Processor', 0)
})


$.getJSON(`/api/specification?type=Hard Disk`, data => {
    harddisk = data
    fillDropDown1('harddisk', data, 'Choose Hard Disk', 0)
})




function fillDropDown1(id, data, label, selectedid = 0) {
    $(`#${id}`).empty()
    $(`#${id}`).append($('<option>').val("null").text(label))

    $.each(data, (i, item) => {
        if (item.id == selectedid) {
            $(`#${id}`).append($('<option selected>').val(item.id).text(item.value))
        } else {
            $(`#${id}`).append($('<option>').val(item.id).text(item.value))
        }
    })

}

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
    console.log(result)
    fillDropDown('pbrandid', categories, 'Choose Category', result.brandname)
    $('#pram').append($('<option>').val(result.ram).text(result.ramname))
    $('#pprocessor').append($('<option>').val(result.processor).text(result.processorname))
    $('#pharddisk').append($('<option>').val(result.harddisk).text(result.harddiskname))

    $('#editdiv').show()
    $('#result').hide()
    $('#insertdiv').hide() 
    $('#pid').val(result.id)
     $('#pname').val(result.name)
     $('#pbrandid').val(result.brandid)
     $('#pprice').val(result.price)
     $('#pdevice_not_work_properly').val(result.device_not_work_properly)
     $('#pusb_port').val(result.usb_port)
     $('#pwire_cut').val(result.pwire_cut)
     $('#psound_crack').val(result.sound_crack)
     $('#pbluetooth').val(result.bluetooth)
     $('#paux_part').val(result.aux_part)
     $('#pair_charger_model_price').val(result.air_charger_model_price)
     $('#ppro_charger_model_price').val(result.pro_charger_model_price)
     $('#pctype_charger_model_price').val(result.ctype_charger_model_price)
     $('#phdmi_port').val(result.hdmi_port)
     $('#plan_port').val(result.lan_port)
     $('#pwire_cut').val(result.wire_cut)

     $('#page').val(result.age)
     $('#page1').val(result.age1)
     $('#page2').val(result.age2)

     $('#pcondition').val(result.condition)
     $('#pcondition1').val(result.condition1)
     $('#pcondition2').val(result.condition2)
     $('#ptype').val(result.type)

     $('#pcondition3').val(result.condition3)
   






     




     if(result.isbluetooth == 'isbluetooth'){
        $('#pisbluetooth').prop( "checked", true );
    
      }
      


  if(result.iswirecut == 'iswirecut'){
    $( "#piswirecut" ).prop( "checked", true );
  }



  if(result.ischarger == 'ischarger'){
    $( "#pischarger" ).prop( "checked", true );
  }




  if(result.isappletv == 'isappletv'){
    $( "#pisappletv" ).prop( "checked", true );
  }



  
  if(result.issound == 'issound'){
    $( "#pissound" ).prop( "checked", true );
  }






  
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
        device_not_work_properly:$('#pdevice_not_work_properly').val(),
        usb_port:$('#pusb_port').val(),
        wire_cut:$('#pwire_cut').val(),
        sound_crack:$('#psound_crack').val(),
        bluetooth:$('#pbluetooth').val(),
        aux_part:$('#paux_part').val(),
        air_charger_model_price:$('#pair_charger_model_price').val(),
        pro_charger_model_price:$('#ppro_charger_model_price').val(),
        ctype_charger_model_price:$('#pctype_charger_model_price').val(),
        wire_cut:$('#pwire_cut').val(),
        hdmi_port:$('#phdmi_port').val(),
        age:$('#page').val(),
        age1:$('#page1').val(),
        age2:$('#page2').val(),
        type:$('#ptype').val(),
        condition:$('#pcondition').val(),
        condition1:$('#pcondition1').val(),
        condition2:$('#pcondition2').val(),


        lan_port:$('#plan_port').val(),
   
     
        isbluetooth :$('#pisbluetooth:checked').val(),
        iswirecut :$('#piswirecut:checked').val(),
        ischarger :$('#pischarger:checked').val(),

        isappletv :$('#pisappletv:checked').val(),
        issound :$('#pissound:checked').val(),




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


