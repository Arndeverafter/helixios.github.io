<template>
  <div>
    <header-vue />
    <section class="mb-5">
      <div class="container">
        <div class="flex">
          <div class="configuration soft-shadow">
            <div class="row">
              <label htmlFor="color">Choose Text Color:</label>
              <input type="color" v-model="textColor" />

              <label class="pl-2"> or </label>
              <input type="text" v-model="textColor" />
            </div>
            <div class="row">
              <label>Gradient</label>
              <input
                type="radio"
                class="btn-check"
                v-model="options"
                id="option1"
                autocomplete="off"
                checked
                value="gradient"
              />
              <label class="pl-2" for="option2">Image Link</label>
              <input
                type="radio"
                class="btn-check"
                v-model="options"
                id="option2"
                autocomplete="off"
                value="image"
              />
            </div>
            <div class="row" v-if="options == 'image'">
              <div class="form__group field">
                <input
                  type="url"
                  class="form__field"
                  v-model="link"
                  placeholder="Image Link"
                />
                <label for="name" class="form__label">Image Link</label>
              </div>
            </div>
            <div class="row">
              <div class="form__group field">
                <textarea
                  class="form__field"
                  v-model="content"
                  maxlength="100"
                  placeholder="Content"
                ></textarea>
                <label for="name" class="form__label">Content</label>
              </div>
            </div>
          </div>
          <div class="configuration soft-shadow" v-if="ready">
            <div class="row" v-if="options == 'gradient'">
              <label> Gradient Settings </label>
              <button
                class="btn btn-rounded btn-small mr-3"
                title="Previous Gradient"
                @click="backward()"
              >
                <span> &#x2190;</span>
              </button>
              <button
                class="btn btn-rounded btn-small mr-3"
                title="Change Gradient Orientation"
                @click="rotate()"
              >
                <span> &#11119;</span>
              </button>
              <button
                class="btn btn-rounded btn-small mr-3"
                title="Next Gradient"
                @click="forward()"
              >
                <span> &#x2192;</span>
              </button>
            </div>
            <div class="row">
              <label> Actions </label>
              <button
                class="btn btn-rounded btn-small mr-3"
                title="Minimize Word Font"
                @click="bodyFontSize++"
              >
                <span> &#9650;</span>
              </button>
              <button
                class="btn btn-rounded btn-small mr-3"
                title="Maximize Word Font"
                @click="bodyFontSize--"
              >
                <span> &#9660;</span>
              </button>
              <button
                class="btn btn-rounded btn-small mr-3"
                title="Download Image"
                @click="download()"
              >
                &#8609;
              </button>

              <button class="btn btn-rounded btn-small mr-3" @click="overlays">
                <span title="Add Overlay" v-if="!overlay"> &#127765; </span>
                <span title="Remove Overlay" v-else> &#127761; </span>
              </button>
            </div>
            <div class="row">
              <button class="btn btn-large btn-rounded" @click="generate()">
                <span>Generate Font</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="container mt-5">
        <div class="container" v-if="ready">
          <div
            class="card"
            ref="printMe"
            :style="currentGradient"
            v-if="options == 'gradient'"
          >
            <div :class="overlay ? 'cards' : ''"></div>

            <div
              class="demo__content"
              :style="`font-family:${bodyFont.family};font-size:${bodyFontSize}px`"
            >
              <p class="text">
                {{ content }}
              </p>
            </div>
          </div>
          <div class="card" ref="printMes" :style="imageLink" v-else>
            <div :class="overlay ? 'cards' : ''"></div>
            <div
              class="demo__content"
              :style="`font-family:${bodyFont.family};font-size:${bodyFontSize}px`"
            >
              <p class="text">
                {{ content }}
              </p>
            </div>
          </div>
        </div>

        <div class="error" v-if="!ready">
          Daily API limit exceeded, please check later.
        </div>

        <!-- <div class="col-md-12">
            <img :src="output" />
          </div> -->
      </div>
    </section>
    <footer-vue />
  </div>
</template>


<script>
import headerVue from "../layouts/header.vue";
import footerVue from "../layouts/footer.vue";
// import FontPicker from "font-picker-vue";
import Gradients from "../utils/colors.json";

export default {
  name: "Cards",
  data() {
    return {
      fonts: null,
      ready: false,
      categories: [],
      output: null,

      // bodyCategory: null,
      bodyCategories: ["sans-serif", "serif", "display", "handwritting"],

      bodyStandart: null,
      bodyImport: null,
      bodyFont: null,
      bodyFontUrl: null,
      bodyFontSize: 18,
      options: "gradient",

      content: "If its not the invisible Sleuth",
      gradients:
        "background: #fc4a1a;background: -webkit-linear-gradient(to right, #fc4a1a, #f7b733); background: linear-gradient(to right, #fc4a1a, #f7b733);",

      currentDirection: "to right",
      textColor: "#ffffff",

      directions: ["to left", "to bottom", "to right", "to top"],
      directionIndex: 2,

      gradients: [],
      count: 0,
      currentIndex: 0,
      colors: [],
      direction: "",
      overlay: false,
      link: "https://www.adweek.com/wp-content/uploads/2020/03/behr-zoom-background-1-2020.jpg",
    };
  },
  computed: {
    currentGradient() {
      return (
        "background: linear-gradient(" +
        this.direction +
        "," +
        this.colors +
        "); color: " +
        this.textColor
      );
    },
    imageLink() {
      return (
        "background-image: url(" +
        this.link +
        "); background-position: center;background-repeat: no-repeat;background-size: cover; color: " +
        this.textColor
      );
    },
  },
  created() {
    this.axios
      .get(
        "https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyAGRkzVCTvgPTkKEmhOxy7lBH-XuQwxPw8"
      )
      .then(
        (response) => {
          this.ready = true;
          this.fonts = response.data.items;
          this.allCategories();
          this.generate();
        },
        () => {
          this.ready = false;
        }
      );
  },
  methods: {
    Initialising() {
      this.fetchGradients();
      this.setCurrentGradient();
    },
    fetchGradients() {
      this.gradients = Gradients.reverse();
      this.count = this.gradients.length;
    },
    forward() {
      if (this.currentIndex > this.count - 1) this.currentIndex = 0;
      else {
        this.currentIndex = this.currentIndex + 1;
      }
      this.setCurrentGradient();
    },
    backward() {
      if (this.currentIndex == 0) this.currentIndex = this.count - 1;
      else {
        this.currentIndex = this.currentIndex - 1;
      }

      this.setCurrentGradient();
    },
    rotate() {
      this.directionIndex = this.directionIndex + 1;
      if (this.directionIndex > 3) this.directionIndex = 0;

      this.direction = this.directions[this.directionIndex];
    },
    overlays() {
      this.overlay = !this.overlay;
    },
    async download() {
      let el;
      let options;

      if (this.options == "gradient") {
        el = this.$refs.printMe;
        options = {
          type: "dataURL",
          backgroundColor: null,
          logging: false,

          scale: 5,
        };
      } else {
        el = this.$refs.printMes;
        options = {
          type: "dataURL",
          backgroundColor: null,
          logging: false,
          scale: 4,
          useCORS: true,
        };
      }

      this.output = await this.$html2canvas(el, options);

      const a = document.createElement("a");
      a.href = this.output;
      a.download = "foggly.png";
      a.click();
    },

    setCurrentGradient() {
      let gradientResult = this.gradients[this.currentIndex];

      this.colors = [...gradientResult.colors].join(", ");
      this.direction = this.currentDirection;
    },

    allCategories() {
      this.fonts
        .filter(
          (category, index, self) =>
            self.findIndex((t) => {
              return t.category === category.category;
            }) === index
        )
        .map((obj) => {
          this.categories.push(obj["category"]);
        });

      this.bodyCategory = this.categories[1];
    },
    fontFilter(category) {
      let tempFonts = [],
        font;
      this.fonts
        .filter((item) => {
          return item.category == category;
        })
        .map((obj) => {
          tempFonts.push(obj);
        });
      font = tempFonts[Math.floor(Math.random() * (tempFonts.length - 1) + 1)];
      return font;
    },
    generate() {
      let item = Math.floor(Math.random() * 3);
      this.bodyCategory = this.bodyCategories[item];

      this.bodyFont = this.fontFilter(this.bodyCategory);
      const combinedFont = document.head.querySelector("#combined-font");
      const googleUrl = "https://fonts.google.com/specimen/";

      this.bodyFontUrl = googleUrl + this.bodyFont.family.replace(/ /g, "+");
      if (combinedFont == null) {
        const link = document.createElement("link");
        link.id = "combined-font";
        link.href = `https://fonts.googleapis.com/css?family=${this.bodyFont.family.replace(
          / /g,
          "+"
        )}`;
        link.rel = "stylesheet";
        document.head.appendChild(link);
      } else {
        combinedFont.href = `https://fonts.googleapis.com/css?family=${this.bodyFont.family.replace(
          / /g,
          "+"
        )}`;
      }
    },
    changeBackground() {
      this.darkBackground
        ? (this.darkBackground = false)
        : (this.darkBackground = true);
    },
  },
  mounted() {
    this.Initialising();
  },

  watch: {
    bodyFontSize(val) {
      val == 11 ? (this.bodyFontSize = 12) : false;
    },
  },
  components: {
    headerVue,
    footerVue,
  },
};
</script>
