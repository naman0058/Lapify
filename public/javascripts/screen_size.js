let categories = []
let subcategories = []
let model = []


let table = 'model'

$('#show').click(function(){
  
$.getJSON(`/admin/screen-size/all`, data => {
    subcategories = data
    makeTable(data)
    
  
})

})



$('#brandid').change(() => {
    const filteredData = model.filter(item => item.brandid == $('#brandid').val())
    console.log('change data',model)
    fillDropDown('modelid', filteredData, 'Choose Model', 0)
})


$.getJSON(`/api/sell-desktop-category`, data => {
    categories = data
    fillDropDown('brandid', categories, 'Choose Brand', 0)
  
})




$.getJSON(`/api/model`, data => {
    model = data
    fillDropDown('modelid', [], 'Choose Model', 0)
  
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
<th>Brand Name</th>
<th>Model Name</th>
<th>Screen Size</th>
<th>Price</th>
<th>Options</th>
</tr>
</thead>
<tbody>`

$.each(categories,(i,item)=>{
table+=`<tr>
<td>${item.brandname}</td>

<td>${item.modelname}</td>
<td>${item.screen_size}</td>
<td>${item.price}</td>
<td>
<a href="#!" class="btn btn-info btn-sm edits" id="${item.id}"><i class="feather icon-edit"></i>&nbsp;Edit </a>
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
     $.get(`/admin/screen-size/delete`,  { id }, data => {
        refresh()
    })
})




$('#pbrandid').change(() => {
    const filteredData = model.filter(item => item.brandid == $('#pbrandid').val())
    console.log(filteredData)
    fillDropDown('pmodelid', filteredData, 'Choose Model', 0)
})


$('#result').on('click', '.edits', function() {
    const id = $(this).attr('id')
    const result = subcategories.find(item => item.id == id);
    // const result = studymaterialsnotes.find(item => item.id == id);

    fillDropDown('pbrandid', categories, 'Choose Brand Name', result.brandid)
    $('#pmodelid').append($('<option>').val(result.modelid).text(result.modelname))

    // fillDropDown('pbrandid', categories, 'Choose Category', result.brandname)
    // fillDropDown('pmodelid', categories, 'Choose Brand', result.modelname)

    $('#editdiv').show()
    $('#result').hide()
    $('#insertdiv').hide() 
    $('#pid').val(result.id)
     $('#pmodelid').val(result.modelid)
     $('#pbrandid').val(result.brandid)
     $('#pprice').val(result.price)
     $('#pscreen_size').val(result.screen_size)
    



   


   
 })



 $('#result').on('click', '.updateimage', function() {
    const id = $(this).attr('id')
    

    const result = subcategories.find(item => item.id == id);
    $('#peid').val(result.id)
})



 
$('#update').click(function(){  //data insert in database
    let updateobj = {
        id: $('#pid').val(),
        brandid:$('#pbrandid').val(),
        modelid:$('#pmodelid').val(),
        screen_size:$('#pscreen_size').val(),
        price:$('#pprice').val()

      
        }

        console.log(updateobj)

    $.post(`/admin/screen-size/update`, updateobj , function(data) {
      update()
    // console.log('res',data)
    })
})






function refresh() 
{
    $.getJSON(`/admin/screen-size/all`, data => makeTable(data))
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


