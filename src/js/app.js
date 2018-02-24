import Vue from "vue"
import axios from "axios"
import hljs from "highlight.js"
import marked from "marked"
// ElementUI
import ElementUI from 'element-ui'

// ElementUIでの言語設定、datePickerとかで適用される
import locale from 'element-ui/lib/locale/lang/ja'

Vue.use(ElementUI, {
  locale
});


marked.setOptions({
  highlight: function(code, lang) {
    return hljs.highlightAuto(code, [lang]).value;
  }
});

var vm = new Vue({
  el: "#app",
  data() {
    return {
      nowTime: 0,
      tableData: [],
      title: 'タイトル',
      subCate: '',
      videoUrl: 'https://rprjie.meijo-u.ac.jp/lectures/Prog4/video/Java_HowToCompile.mp4',
      loaded: "",
      source: "",
      videoData: ["", "", "", ""],
      chapOk: true,
      selectNow: 0,
      markSelect: 0,
      tempName: "",
      deleteIndex: -1,
      exportJson: "",
      editedMarkDown: "# タイトル  \n上のボタンから編集してください"
    }
  },
  mounted() {
    const video = document.getElementById("video");
    video.addEventListener('timeupdate', () => {
      this.nowTime = video.currentTime | 0;
    }, false);
  },
  methods: {
    say: function(index) {
      this.chapOk = true;
      this.moveScroll(this.nowTime);
      const video = document.getElementById("video");
      video.currentTime = this.tableData[index].time;
      video.play();
    },
    saisei: function() {
      if (this.selectNow != 0) return
      this.chapOk = true;
      this.moveScroll(this.nowTime);
      video.paused ? video.play() : video.pause();
    },
    update: async function() {
      // var getData = await getJson(this.$route.params.id.toString())
      //
      // this.title = getData.title
      // this.subCate = getData.subCategory
      // this.videoUrl = getData.url
      // this.videoData[0] = "/video/" + getData.preVideo
      // this.videoData[1] = "/video/" + getData.nextVideo
      // this.videoData[2] = getData.preName
      // this.videoData[3] = getData.nextName
      //
      // this.tableData = getTable(getData.chapter)
      // this.source = marked(getData.source["1"].replace(/\'/g, '\"'));

    },
    moveScroll: function(nowt) {
      this.tableData.forEach((data, index, array) => {
        if (this.chapOk && data.time <= nowt && nowt < data.endTime) {
          document.getElementById("tableBody").scrollTop = index * 42;
        }
      })
    },
    addChapter: function(nowt, name) {
      this.tableData.push({
        time: nowt || 0,
        endTime: nowt + 1,
        name: name,
        nowPlay: false
      })
      this.tableData.sort(function(a, b) {
        return (a.time < b.time) ? -1 : 1;
      });
    },
    chapterDelete: function(index) {
      if (this.selectNow == index + 100) {
        delete this.tableData[index + ""]
        this.selectNow = 0;
      } else {
        this.selectNow = index + 100;
      }
    },
    updateMarkDown: function() {
      if (this.selectNow == 11) this.source = marked(this.editedMarkDown)
      this.markSelect = this.markSelect == 1 ? 0 : 1
    },
    createJson: function() {

      var time = "12"
      var name = "nameads"
      var retJson = {
        "title": this.title,
        "url": this.videoUrl,
        "subCategory": this.subCate,
        "chapter": [],
        "source": this.editedMarkDown,
        "nextVideo": this.videoData[0],
        "preVideo": this.videoData[1],
        "nextName": this.videoData[2],
        "preName": this.videoData[3]
      }

      var chapterData = this.tableData
      for (var val in chapterData) {
        const time = chapterData[val].time + ""
        const name = chapterData[val].name
        if (chapterData[val]) {
          retJson.chapter.push({
            "time": time,
            "name": name
          })
        }
      }

      if (this.selectNow != 10) this.exportJson =
        JSON.stringify(retJson, null, '   ');
      this.markSelect = this.markSelect == 2 ? 0 : 2
    }
  },


  created: async function() {
    this.loaded = "loaded"
    this.update()
    // this.exportJson = JSON.stringify({
    //   a: 2
    // }, null, '   ');
    this.source = marked(this.editedMarkDown)
  },
  filters: {
    toTime: function(value) {
      return Math.floor(value / 60) + ":" + ('00' + (value % 60)).slice(-2);
    },
    marked: marked
  },
  watch: {
    nowTime: function(nowt) {
      if (document.getElementById("tableBody").scrollTop % 42 != 0) this.chapOk = false
      this.moveScroll(nowt);
    },
    '$route' (to, from) {
      this.update()
    }
  }
})

// this.app.$options.methods.update(this.app.$options.data)///