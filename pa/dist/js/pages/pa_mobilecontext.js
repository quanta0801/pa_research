// // initialised variables
// var do_tier1_total = {};
// var do_tier2_total = {};
// var br_tier1_total = {};
// var br_tier2_total = {};
// var ne_type_total = {};
// var table = $("#top_domain_table").DataTable({});
//
// // create key value array from dictionary
// function dictToKeyValue(dict){
//     return Object.keys(dict).map(function(key) {
//         return [key, dict[key]];
//     });
// }
// // sort array by value
// function sortSecondValue(first, second) {
//     return second[1] - first[1];
// }
// // function for previous 2 functions
// function dictToSortedArray(dict) {
//     return  dictToKeyValue(dict).sort(sortSecondValue)
// }

$(function() {
    // create key value array from dictionary
    function dictToKeyValue(dict){
        return Object.keys(dict).map(function(key) {
            return [key, dict[key]];
        });
    }
    // sort array by value
    function sortSecondValue(first, second) {
        return second[1] - first[1];
    }
    // function for previous 2 functions
    function dictToSortedArray(dict) {
       return  dictToKeyValue(dict).sort(sortSecondValue)
    }

    // create sorted arrays of frequency dictionaries
    var sorted_do_tier1 = dictToSortedArray(do_tier1_total);
    var sorted_do_tier2 = dictToSortedArray(do_tier2_total);
    var sorted_br_tier1 = dictToSortedArray(br_tier1_total);
    var sorted_br_tier2 = dictToSortedArray(br_tier2_total);
    var sorted_ne_type = dictToSortedArray(ne_type_total);

    // $("#top_domain_list").html("");
    var rowHtml = "<tr>";
    rowHtml += "<td>2</td>";
    rowHtml += "<td>facebook</td>";
    rowHtml += "<td>social</td>";
    rowHtml += "<td>social</td>";
    rowHtml += "<td>54321</td>";
    rowHtml += "<td>4321</td>";
    rowHtml += "</tr>";
    $("#top_domain_list").append(rowHtml);

    $("#sample_size_widget").text("23,421");
    // $("#sample_size_widget").text(Number(22421).toLocaleString('en'));
});