var mAMap = new AMap.Map('mapContainer');
mAMap.setZoom(12);
mAMap.setCenter([113.68, 34.755]);

var mMarkerGroup = {
    gschool: [],
    ghospital: [],
    gmetro: [],
    gsupermarket: []
};

var mSchoolDatas = initSchools();
var mHospitalDatas = initHospitals();
var mMetroDatas = initMetros();
var mSupermarketDatas = initSupermarkets();

var addPoint = function (data, config) {
    var div = document.createElement('div');
    div.className = config.divName;
    div.innerHTML = config.title;
    var marker = new AMap.Marker({
        content: div,
        title: data["name"],
        position: data["position"],
        offset: new AMap.Pixel(-7, -7),
    });
    var markerClick = function (e) {
        var infoWindow = new AMap.InfoWindow();
        infoWindow.setContent(e.target.getTitle());
        infoWindow.open(mAMap, e.target.getPosition());
    };
    marker.on('click', markerClick);
    var circle = new AMap.Circle({
        center: marker.getPosition(),// 圆心位置
        radius: config.circleRadius, //半径
        strokeColor: config.circleColor, //线颜色
        strokeOpacity: 0.2, //线透明度
        strokeWeight: 1, //线粗细度
        fillColor: config.circleColor, //填充颜色
        fillOpacity: 0.1//填充透明度
    });
    circle.setMap(mAMap);
    marker.setMap(mAMap);
    return {
        "marker": marker,
        "circle": circle
    };
};

function loadData(type, name, markergroup, datas) {
    var container = document.createElement('div');
    container.className = 'data-group-' + type + 's';
    container.innerHTML = '<p class="group-title">' + name + '</p>';
    for (var i = 0; i < datas.length; i++) {
        container.innerHTML += "<p>" +
            "<input class='checkbox' checked type='checkbox' value='g" + type + "-" + i + "'/>" + datas[i].title +
            "<input class='circleRadius' id=g" + type + "-" + i + "-" + j + " type='number' min='100' step='100' value='" + datas[i].config.circleRadius + "'/>" + "米" +
            "</p>";
        markergroup.push(new Array());
        for (var j = 0; j < datas[i].datas.length; j++) {
            markergroup[i].push(addPoint(datas[i].datas[j], datas[i].config));
        }
    }
    $("#nav").append(container);
}

loadData('school', '教育', mMarkerGroup.gschool, mSchoolDatas);
loadData('hospital', '医疗', mMarkerGroup.ghospital, mHospitalDatas);
loadData('metro', '交通', mMarkerGroup.gmetro, mMetroDatas);
loadData('supermarket', '购物', mMarkerGroup.gsupermarket, mSupermarketDatas);

(function ($, undefined) {

    var $document = $(document);

    $document.ready(function () {

        $(".menu-button, .nav-close").on("click", function (e) {
            e.preventDefault();
            $("body").toggleClass("nav-opened nav-closed");
        });

        $(".nav .checkbox").on('click', function () {
            var datas = mMarkerGroup[$(this).prop('value').split('-')[0]][$(this).prop('value').split('-')[1]];
            if ($(this).prop('checked') == true) {
                for (var i = 0; i < datas.length; i++) {
                    mAMap.add(datas[i].marker);
                    mAMap.add(datas[i].circle);
                }
            } else {
                for (var i = 0; i < datas.length; i++) {
                    mAMap.remove(datas[i].marker);
                    mAMap.remove(datas[i].circle);
                }
            }
        });

        $(".nav .circleRadius").on('input', function () {
            var id = $(this).prop('id');
            var datas = mMarkerGroup[id.split('-')[0]][id.split('-')[1]];
            var radius = $(this).prop('value');
            for (var i = 0; i < datas.length; i++) {
                datas[i].circle.setOptions({'radius': radius});
            }
        });

    });
})(jQuery);