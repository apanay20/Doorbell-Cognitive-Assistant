const domain = "http://localhost/Server/"
const production = false;

document.getElementById("form").setAttribute("action",domain+"upload.php");

var busy = false;
var meeting = false;
var notify = false;
var rec_message = false;

var busyOpt = document.getElementById("busy");
var meetingOpt = document.getElementById("meeting");
var notifyOpt = document.getElementById("notify");
var rec_messageOpt = document.getElementById("rec_message");

busyOpt.addEventListener('change', (event) => {
  if (event.currentTarget.checked) {
    busy = true;
    if (meetingOpt.checked === true){
        meetingOpt.checked = false;
        meeting = false;
    }
  } else {
    busy = false;
  }
})

meetingOpt.addEventListener('change', (event) => {
  if (event.currentTarget.checked) {
    meeting = true;
    if (busyOpt.checked === true){
        busyOpt.checked = false;
        busy = false;
    }
  } else {
    meeting = false;
  }
})

notifyOpt.addEventListener('change', (event) => {
  if (event.currentTarget.checked) {
    notify = true;
  } else {
    notify = false;
  }
})

rec_messageOpt.addEventListener('change', (event) => {
  if (event.currentTarget.checked) {
    rec_message = true;
  } else {
    rec_message = false;
  }
})

setInterval( function(){
    if(meeting || busy){
        notifyOpt.disabled = false;
        rec_messageOpt.disabled = false;
    }else{
        notifyOpt.disabled = true;
        notifyOpt.checked = false;
        rec_messageOpt.disabled = true;
        rec_messageOpt.checked = false;
    }
}, 100);

// Show all images in the "faces" folder
// If a photo is clicked -> call the function bellow
showImages();
function showImages(){
    document.getElementById("images").innerHTML = "";
    var folder = "faces/";
    document.getElementById("images").innerHTML = "";
    $.ajax({
        url : domain + folder,
        success: function (data) {
            $(data).find("a").attr("href", function (i, val) {
                if( val.match(/\.(jpg|jpeg|png|gif)$/) ) {
                    $("#images").append( "<div class='img-class'><img src='"+ domain + folder + val +"' onclick=\"deleteImage('"+val+"',this)\" width=150px height=150px padding-bottom=10px></div>" );
                } 
            });
        }
    });
};

// If you press the image -> the image will be deleted
function deleteImage(img_name,self){
      $.ajax({
        type: "POST",
        url: domain + '/delete.php',
        data: {name: img_name},
        success: function(data){
            self.parentElement.remove();
            showImages();
            alert(data);
            location.reload();            
        }
    });
}

$(document).ready(function (e) {
    $('#form').on('submit',(function(e) {
        e.preventDefault();
        var formData = new FormData(this);

        $.ajax({
            type:'POST',
            url: $(this).attr('action'),
            data:formData,
            cache:false,
            contentType: false,
            processData: false,
            success:function(data){
                showImages();
                alert(data);
                location.reload();
            },
            error: function(data){
                alert(data);
            }
        });
    }));    
});  