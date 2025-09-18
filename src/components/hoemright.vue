<template>
      <div>
        <div>
          <div :style="xs||sm?{'display':'none'}:{'font-size':'4rem'}" class="leleo-left-welcome">{{ configdata.welcometitle }}</div>
        </div>
        <div>
          <v-row align="center">
            <v-col cols="12" md="8">
				<v-text-field class="v-card"
					:style="xs||sm?{'display':'none'}:{}"
					v-model="searchQuery"
					placeholder="搜索..."
					variant="outlined"
					rounded
					hide-details="true"
					@keyup.enter="performSearch"
					>
					<template v-slot:prepend-inner>
						<v-menu>
							<template v-slot:activator="{ props }">
							<v-btn
								variant="text"
								v-bind="props"
								class="engine-btn"
							>
								{{ selectedEngine.title }}
								<v-icon icon="mdi-chevron-down"></v-icon>
							</v-btn>
							</template>
							<v-list class="glass-list">
								<v-list-item
									v-for="engine in searchEngines"
									:key="engine.value"
									@click="selectedEngine = engine"
									density="compact"
								>
									{{ engine.title }}
								</v-list-item>
							</v-list>
						</v-menu>
					</template>

					<template v-slot:append-inner>
						<v-btn
						:icon="isUrl ? 'mdi-earth' : 'mdi-magnify'"
						variant="text"
						@click="performSearch"
						></v-btn>
					</template>
					</v-text-field>
            	<typewriter class="ma-3 d-flex align-center justify-center" style="min-height: 200px;"></typewriter>
            </v-col>
            <v-col cols="12" md="4" align="center">
              <v-card class="ma-3" hover
                >
                  <template v-slot:title >
                    <span class="leleo-card-title clock-font">{{formattedTime}}</span>
                  </template>
                  <template v-slot:subtitle>
                    <span style="font-weight: bold;">{{formattedDate}}</span>
                  </template>
                  <turntable :color1="configdata.color.turntablecolor1" :color2="configdata.color.turntablecolor2" />
              </v-card>
            </v-col>
          </v-row>
          
          <v-chip class="mt-3 ml-3" prepend-icon="mdi-webhook"  size="large" style="color: var(--leleo-vcard-color);">
            部署项目
          </v-chip>
          <v-container>
            <v-row>
              <v-col
                v-for="(item,key) in projectcards"
                cols="6"
                md="4"
                lg="3"
                :style="xs?{'padding': '6px'}:{}"
              >
                <v-card class="">
                  <v-img
                    aspect-ratio="1.7778"
                    :src= item.img
                    cover
                    :style="{ opacity: 0.8 }"
                  ></v-img>
                  <v-card-title :style="xs?{'font-size': '0.9rem','padding': '0.15rem 0.5rem'}:{'font-size': '1.1rem','padding':'0.2rem 0.8rem'}">
                    {{item.title}}
                  </v-card-title>
                  <v-card-subtitle :style="xs?{'font-size': '0.6rem','padding': '0.1rem 0.5rem'}:{'font-size': '0.8rem','padding':'0.15rem 0.6rem'}">
                    {{ item.subtitle }}
                  </v-card-subtitle>

                  <v-card-actions :style="xs||sm||md?{'padding': '0','min-height': '0','height':'2.5rem'}:{'min-height': '0','height':'2.8rem'}">
                    <v-btn :href="item.url"
                    target="_blank"
                      :text= "item.go"
                    ></v-btn>
                    <v-spacer></v-spacer>
                    <v-btn
                      :icon="item.show ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                      @click="item.show = !item.show;projectcardsShow(key);"
                    ></v-btn>
                  </v-card-actions>
                  <v-expand-transition>
                    <div v-show="item.show">
                      <v-divider></v-divider>
                      <v-card-text :style="xs?{'font-size': '0.7rem'}:{}">
                        {{item.text}}
                      </v-card-text>
                    </div>
                  </v-expand-transition>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
          
          <!-- Blog section -->
          <v-chip class="mt-6 ml-3" prepend-icon="mdi-notebook-edit" size="large" style="color: var(--leleo-vcard-color);">
            博客文章
          </v-chip>
          <v-container>
            <v-row>
              <v-col cols="12" md="8">
                <v-list class="v-card" lines="two" density="comfortable">
                  <v-list-item
                    v-for="post in blogIndex"
                    :key="post.slug"
                    @click="openPost(post.slug)"
                    :title="post.title"
                    :subtitle="formatPostSubtitle(post)"
                  >
                    <template v-slot:prepend>
                      <v-icon color="var(--leleo-vcard-color)">mdi-note-text</v-icon>
                    </template>
                  </v-list-item>
                  <v-list-item v-if="!blogLoading && blogIndex.length===0" title="暂无文章" subtitle="请在 posts/ 放入 .md 后构建"></v-list-item>
                  <div v-if="blogLoading" class="ma-3" align="center">
                    <v-progress-circular indeterminate></v-progress-circular>
                  </div>
                </v-list>
              </v-col>
            </v-row>
          </v-container>

          <v-dialog v-model="postDialog" width="900">
            <v-card class="ma-2 pa-2" variant="tonal" rounded="lg" style="backdrop-filter: blur(10px);">
              <template v-slot:title>
                <span class="leleo-card-title">{{ currentPost?.title || '加载中...' }}</span>
              </template>
              <v-card-subtitle>{{ currentPost ? formatDate(currentPost.date) : '' }}</v-card-subtitle>
              <v-divider></v-divider>
              <v-card-text style="max-height: 70vh; overflow:auto;">
                <div v-if="postLoading" align="center" class="ma-6">
                  <v-progress-circular indeterminate></v-progress-circular>
                </div>
                <div v-else v-html="currentPost?.html"></div>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn variant="tonal" color="var(--leleo-vcard-color)" @click="postDialog=false">关闭</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          
        </div       
      </div>
</template> 

<script>
import typewriter from '../components/typewriter.vue';
import turntable from '../components/turntable.vue';
import { useDisplay } from 'vuetify'

export default {
    components: {
        typewriter,turntable
    },
    props: ['configdata','formattedTime','formattedDate','projectcards'],
	data() {
		return {
			searchQuery: '',
			selectedEngine: { title: 'Bing', value: 'bing' },
      		searchEngines :[
				{ title: 'Bing', value: 'bing' },
				{ title: 'Google', value: 'google' },
				{ title: '百度', value: 'baidu' },
				{ title: 'Yandex', value: 'yandex' },
				{ title: 'DuckDuckGo', value: 'duckduckgo' },
			],
			blogIndex: [],
			blogLoading: false,
			postDialog: false,
			currentPost: null,
			postLoading: false,
		}
	},
    setup() {
      const { xs,sm,md } = useDisplay();
      return {xs,sm,md};
    },
	computed: 	{
		isUrl(){
			const str = this.searchQuery.trim();
  			return this.isLikelyUrl(str);
		}
	},
	mounted(){
		this.loadBlogIndex();
	},
    methods:{
      projectcardsShow(key){
        for(let i = 0;i < this.projectcards.length;i++){
          if(i != key){
            this.projectcards[i].show = false;
          }
        }
      },
	  async loadBlogIndex(){
		this.blogLoading = true;
		try{
			const res = await fetch('/blog/index.json', { cache: 'no-cache' });
			if(res.ok){
				this.blogIndex = await res.json();
			}else{
				this.blogIndex = [];
			}
		}catch(e){
			this.blogIndex = [];
		}finally{
			this.blogLoading = false;
		}
	  },
	  async openPost(slug){
		this.postDialog = true;
		this.postLoading = true;
		this.currentPost = null;
		try{
			const res = await fetch(`/blog/${slug}.json`, { cache: 'no-cache' });
			if(res.ok){
				this.currentPost = await res.json();
			}
		}finally{
			this.postLoading = false;
		}
	  },
	  formatPostSubtitle(post){
		const date = this.formatDate(post.date);
		const tags = post.tags && post.tags.length ? ` · ${post.tags.join(', ')}` : '';
		return `${date}${tags} · ${post.summary || ''}`;
	  },
	  formatDate(iso){
		try{ return new Date(iso).toLocaleString(); }catch{ return iso; }
	  },
      performSearch() {
		const query = this.searchQuery.trim();
		if (!query) return;

		if (this.isUrl) {
			let url = query;
			// 自动补全协议（如果缺少）
			if (!/^[a-z]+:\/\//i.test(url)) {
				url = 'http://' + url; // 默认用http
			}
			
			window.open(url, '_blank');
		} else {
			const engineUrls = {
				google: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
				bing: `https://www.bing.com/search?q=${encodeURIComponent(query)}`,
				baidu: `https://www.baidu.com/s?wd=${encodeURIComponent(query)}`,
				yandex: `https://yandex.com/search/?text=${encodeURIComponent(query)}`,
				duckduckgo: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`
			};
			window.open(engineUrls[this.selectedEngine.value], '_blank');
		}
	  },
	  isLikelyUrl(input) {
		// 移除首尾空格
		const str = input.trim();
		
		// 情况1：明确包含协议头（http/https/ftp等）
		if (/^(https?|ftp):\/\//i.test(str)) return true;
		
		// 情况2：符合域名格式（支持国际化域名）
		const domainPattern = /^([a-z0-9-]+\.)+[a-z]{2,}(\/.*)?$/i;
		
		// 情况3：localhost或IP地址
		const localPattern = /^(localhost|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(:\d+)?(\/.*)?$/i;
		
		
		return (
			domainPattern.test(str) || 
			localPattern.test(str)
		);
		}
    }
};
</script>

<style scoped>
@import url(/css/app.less);
@import url(/css/mobile.less);
.glass-list {
	background: transparent !important;
	backdrop-filter: blur(var(--leleo-blur));
	border-radius: 5%;
	color: var(--leleo-vcard-color);
	overflow: hidden;
}
</style>