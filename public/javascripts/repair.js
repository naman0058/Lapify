let categories = []
let subcategories = []
let parts = []


let table = 'model'

$('#show').click(function(){
  
$.getJSON(`/repair/all`, data => {
    parts = data
    makeTable(data)
    
  
})

})


$.getJSON(`/api/part/category`, data => {
    categories = data
    fillDropDown('brandid', data, 'Choose Brand', 0)
  
})


$('#brandid').change(() => {
    const filteredData = subcategories.filter(item => item.brandid == $('#brandid').val())
    fillDropDown('modelid', filteredData, 'Choose Model', 0)
})



$('#pbrandid').change(() => {
    const filteredData = subcategories.filter(item => item.brandid == $('#pbrandid').val())
    fillDropDown('pmodelid', filteredData, 'Choose Model', 0)
})


$.getJSON(`/model/all`, data => {
    subcategories = data
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
<th>Image</th>
<th>Brand Name</th>
<th> Name</th>

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
     $.get(`/repair/delete`,  { id }, data => {
        refresh()
    })
})



$('#result').on('click', '.edits', function() {
    const id = $(this).attr('id')
    const result = parts.find(item => item.id == id);
    fillDropDown('pbrandid', categories, 'Choose Category', result.brandname)
    $('#pmodelid').append($('<option>').val(result.modelid).text(result.modelname))


    $('#editdiv').show()
    $('#result').hide()
    $('#insertdiv').hide() 
    $('#pid').val(result.id)
     $('#pname').val(result.name)
     $('#pbrandid').val(result.brandid)
     $('#pprice').val(result.price)
    // $('#pmodelid').val(result.modelid)

   
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

        
       
        }

    $.post(`/repair/update`, updateobj , function(data) {
       update()
    })
})






function refresh() 
{
    $.getJSON(`/repair/all`, data => makeTable(data))
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


