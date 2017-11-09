import { highlightRange } from './highlight-range.js';
import { ColorHash } from './color-hash.js';
import { Base64 } from './base64.js';
import { createStore, applyMiddleware } from 'redux';

const INITIAL_STATE = {
  ui: {
    isRendering: false,
    user: 'jmakeig',
  },
  model: {
    annotations: [],
    // <https://help.github.com/articles/getting-permanent-links-to-files/>
    href:
      'https://github.com/jmakeig/markdown-annotations/blob/fa2530c83142cd1405cca52d5caa2c2c6abc66fd/Nausgaard%20ugh%20XOXO.md',
    commit: 'fa2530c83142cd1405cca52d5caa2c2c6abc66fd',
    content: `---
title: MarkLogic Consolidated Vision
author:
- Justin Makeig
history: |
  
  * Things
  * Stuff

...

## Nausgaard ugh XOXO {#nausgaard}
 
Knausgaard ugh XOXO flannel pok pok marfa pork belly sustainable cronut la croix vice palo santo actually ethical. 

  * Cornhole plaid tumblr PBR&B
  * Semiotics echo park 
  * iPhone post-ironic tacos banh mi. 
  
Heirloom roof party godard letterpress ramps butcher single-origin coffee. Scenester glossier food truck poke lomo, blue bottle godard art party chartreuse fingerstache tumblr humblebrag wayfarers pickled. 

  1. Squid drinking vinegar chambray enamel pin. Meh tumblr everyday carry, helvetica migas direct trade cardigan marfa. 
    1. Try-hard authentic XOXO shaman polaroid pork belly. Helvetica blue bottle photo booth messenger bag, direct trade portland trust fund affogato. 
      1. Tattooed cred tumblr paleo adaptogen semiotics YOLO forage vexillologist mumblecore snackwave venmo listicle four loko mustache. 
        1. 8-bit chillwave selvage etsy wolf organic tattooed keffiyeh viral jianbing skateboard tote bag deep v artisan. Poke venmo normcore put a bird on it bespoke succulents tote bag la croix pitchfork glossier. Jianbing taxidermy raclette salvia next level asymmetrical, shaman palo santo vexillologist listicle woke cronut. Craft beer succulents pop-up ugh, cray keytar ennui gluten-free tacos food truck truffaut.

Literally unicorn pork belly, pabst hell of tbh ramps cred. Brooklyn neutra intelligentsia artisan chartreuse. Truffaut kale chips air plant, whatever +1 etsy pitchfork distillery butcher next level locavore chia. Disrupt squid tumblr chia migas. YOLO kitsch man bun vice polaroid gentrify quinoa irony narwhal. YOLO fixie beard slow-carb actually artisan kale chips tofu meditation meh coloring book pitchfork air plant food truck dreamcatcher. Hell of celiac tousled cornhole, microdosing green juice whatever occupy pour-over. Celiac fanny pack scenester drinking vinegar tumeric copper mug succulents street art. Vape XOXO tote bag pitchfork cardigan actually hoodie kale chips photo booth craft beer. Mlkshk try-hard cred, synth kogi +1 single-origin coffee enamel pin literally snackwave four dollar toast. Raclette enamel pin hella sartorial celiac man bun copper mug squid. Godard beard gochujang, roof party poutine shabby chic etsy iceland. Swag palo santo readymade la croix.

  * Squid drinking vinegar chambray enamel pin. Meh tumblr everyday carry, helvetica migas direct trade cardigan marfa. 
    - Try-hard authentic XOXO shaman polaroid pork belly. Helvetica blue bottle photo booth messenger bag, direct trade portland trust fund affogato. 
      * Tattooed cred tumblr paleo adaptogen semiotics YOLO forage vexillologist mumblecore snackwave venmo listicle four loko mustache. 
        - 8-bit chillwave selvage etsy wolf organic tattooed keffiyeh viral jianbing skateboard tote bag deep v artisan. Poke venmo normcore put a bird on it bespoke succulents tote bag la croix pitchfork glossier. Jianbing taxidermy raclette salvia next level asymmetrical, shaman palo santo vexillologist listicle woke cronut. Craft beer succulents pop-up ugh, cray keytar ennui gluten-free tacos food truck truffaut.

## Yuccie Craft Beer

Austin humblebrag unicorn asymmetrical keffiyeh chillwave raw denim master cleanse microdosing before they sold out chicharrones cred. Chillwave flannel iPhone, glossier try-hard shabby chic helvetica salvia. 

  * Before they sold out normcore fixie mustache
    - Pop-up enamel pin marfa yr four 
    - Loko vape stumptown. 
  * You probably haven't heard of them 
    - Migas vaporware normcore 
    - Helvetica drinking vinegar 
    - Man braid jianbing kinfolk 
      - DIY fixie master cleanse irony. 
      
Tattooed tilde direct trade raw denim unicorn adaptogen authentic pitchfork air plant gluten-free tacos. Lomo heirloom typewriter celiac kale chips hashtag. Humblebrag echo park artisan +1, pork belly green juice master cleanse jean shorts lumbersexual yr swag vice activated charcoal selfies. Gochujang disrupt asymmetrical 8-bit listicle man bun blog edison bulb tofu. Aesthetic iPhone subway tile green juice stumptown seitan, lomo master cleanse tbh cronut craft beer skateboard.

## Fanny Pack Tote Bag {#tote}

  * Vinyl af, ramps selvage chia ugh fashion axe master cleanse. Tote bag taiyaki PBR&B chicharrones four dollar toast cray tousled palo santo. Listicle asymmetrical af aesthetic. Sriracha asymmetrical fashion axe VHS pug XOXO synth biodiesel pitchfork. Lo-fi truffaut blue bottle mixtape, scenester ramps poutine. 
  * Yr godard pickled, lo-fi asymmetrical keytar chillwave shoreditch. Kitsch gluten-free lumbersexual thundercats seitan keffiyeh iPhone drinking vinegar ramps bicycle rights 3 wolf moon twee quinoa. Bespoke bitters vinyl normcore squid. Four dollar toast banjo vexillologist skateboard sartorial drinking vinegar organic chambray unicorn authentic tousled next level williamsburg. 
    * Direct trade master cleanse trust fund drinking vinegar literally tofu, hoodie keytar vice try-hard everyday. 
    * Carry plaid cardigan cray. Butcher kale chips palo santo jianbing. Banjo stumptown portland normcore squid activated charcoal church-key farm-to-table slow-carb snackwave hexagon truffaut.

Fingerstache hammock bicycle rights cliche tousled freegan. Sartorial tousled kombucha cliche. Authentic single-origin coffee activated charcoal, occupy raclette hot chicken +1 unicorn farm-to-table post-ironic cray. Adaptogen thundercats mumblecore actually ennui, man bun bespoke. Chia cliche kitsch edison bulb tilde, normcore intelligentsia vape shoreditch farm-to-table organic selfies authentic. Tattooed beard scenester kitsch, distillery cray venmo cronut aesthetic. Humblebrag roof party vape lomo, 90's portland skateboard mumblecore messenger bag fam tofu hammock tote bag aesthetic. Marfa aesthetic direct trade kombucha. Portland godard hoodie selvage, enamel pin quinoa mixtape wolf hexagon iceland. Cray biodiesel fam, post-ironic leggings tattooed subway tile cornhole bitters dreamcatcher raw denim VHS etsy letterpress viral.

### Sartorial Kogi Meditation {#Meditation}

Sartorial kogi meditation gastropub, ethical shabby chic paleo asymmetrical franzen live-edge pug. Viral blog chambray bitters, tofu shabby chic kitsch pitchfork. IPhone slow-carb twee keffiyeh edison bulb. Cornhole street art biodiesel, wayfarers messenger bag farm-to-table VHS. Readymade pour-over gentrify, celiac gastropub beard gochujang waistcoat sustainable salvia. Next level shaman snackwave roof party typewriter schlitz deep v fashion axe hell of ramps salvia YOLO skateboard copper mug. Cold-pressed yuccie distillery hot chicken celiac chambray cray adaptogen intelligentsia godard next level. Twee pork belly everyday carry tumeric, hammock pug swag hell of disrupt vaporware sriracha lo-fi. Leggings chia master cleanse vegan. 8-bit kale chips chartreuse, irony flexitarian taiyaki cardigan dreamcatcher organic narwhal post-ironic shaman meggings heirloom echo park.

  11. Squid drinking vinegar chambray enamel pin. Meh tumblr everyday carry, helvetica migas direct trade cardigan marfa. 
    111. Try-hard authentic XOXO shaman polaroid pork belly. Helvetica blue bottle photo booth messenger bag, direct trade portland trust fund affogato. 
      1111. Tattooed cred tumblr paleo adaptogen semiotics YOLO forage vexillologist mumblecore snackwave venmo listicle four loko mustache. 
        11111. 8-bit chillwave selvage etsy wolf organic tattooed keffiyeh viral jianbing skateboard tote bag deep v artisan. Poke venmo normcore put a bird on it bespoke succulents tote bag la croix pitchfork glossier. Jianbing taxidermy raclette salvia next level asymmetrical, shaman palo santo vexillologist listicle woke cronut. Craft beer succulents pop-up ugh, cray keytar ennui gluten-free tacos food truck truffaut.


Pickled typewriter la croix chicharrones church-key air plant hell of you probably haven't heard of them waistcoat bushwick. Tbh VHS vinyl yr taiyaki cronut 90's kale chips literally woke. Literally hammock vinyl banjo crucifix narwhal selfies DIY vexillologist keytar. Fixie etsy literally, gluten-free beard leggings biodiesel. Kombucha blue bottle thundercats authentic green juice. Lyft church-key air plant tousled tbh. Stumptown marfa raclette next level pabst. Vice freegan aesthetic kombucha single-origin coffee, poke blue bottle irony sustainable mixtape actually hashtag gastropub literally enamel pin. Listicle keffiyeh hella direct trade beard, heirloom salvia normcore seitan. Yuccie +1 put a bird on it pour-over celiac. Gluten-free single-origin coffee leggings mumblecore irony copper mug before they sold out plaid brunch iceland.

## Mlkshk Deep v. Umami

Single-origin coffee, poke hell of pour-over disrupt fashion axe copper mug. Butcher scenester thundercats, deep v kitsch fixie 3 wolf moon taxidermy humblebrag. Post-ironic asymmetrical fingerstache keytar biodiesel. Pour-over man bun yuccie freegan wolf. Chia sartorial bespoke literally fixie meditation. Squid woke PBR&B authentic beard hashtag prism fingerstache pitchfork, YOLO before they sold out bespoke coloring book disrupt freegan. Williamsburg chia subway tile bicycle rights kale chips knausgaard, schlitz blog hell of PBR&B. Crucifix mixtape try-hard selvage. Af hexagon you probably haven't heard of them narwhal man braid +1 pok pok. Put a bird on it lo-fi heirloom XOXO dreamcatcher letterpress raclette roof party biodiesel cliche microdosing single-origin coffee crucifix intelligentsia. Mustache gentrify enamel pin deep v +1 freegan air plant.

> Wolf schlitz letterpress helvetica listicle irony man braid. Hella four dollar toast pabst tilde cray. Hot chicken palo santo aesthetic, flexitarian XOXO forage poutine vaporware vegan hammock dreamcatcher mustache. Gochujang brunch swag, next level pour-over stumptown hot chicken heirloom vegan blue bottle austin kinfolk. Everyday carry copper mug enamel pin try-hard, chillwave quinoa coloring book food truck vaporware. Try-hard vinyl cornhole, lo-fi intelligentsia bushwick man bun post-ironic forage. Drinking vinegar man bun VHS direct trade yuccie adaptogen jianbing green juice unicorn tumblr narwhal polaroid. Vegan tousled yr, retro quinoa shoreditch hammock sriracha brunch microdosing kale chips you probably haven't heard of them pinterest. Neutra vice vexillologist listicle, gluten-free hot chicken readymade thundercats man braid venmo mustache wolf food truck. Selvage hammock master cleanse swag, beard neutra next level normcore lumbersexual bitters kale chips kombucha flexitarian farm-to-table. Umami palo santo pop-up, meh unicorn gentrify disrupt vaporware DIY intelligentsia.

Yuccie taxidermy deep v selfies tacos meh locavore slow-carb. Authentic tilde raw denim semiotics tbh. Vape tacos gentrify intelligentsia, poke beard seitan humblebrag raclette schlitz bespoke godard church-key everyday carry waistcoat. Banh mi jean shorts snackwave cornhole chia vice. Stumptown chicharrones photo booth vinyl, hammock pour-over af. Fanny pack asymmetrical ramps, plaid cardigan ennui actually chambray pork belly. Edison bulb copper mug asymmetrical listicle, paleo activated charcoal small batch offal sriracha keffiyeh pabst locavore banh mi waistcoat master cleanse. Cloud bread raw denim flexitarian af shaman mustache authentic cornhole tote bag tilde distillery vice. YOLO four dollar toast deep v helvetica sustainable austin jianbing distillery lumbersexual shoreditch offal. Cray swag letterpress put a bird on it actually, cold-pressed pok pok vice try-hard VHS shoreditch. Biodiesel deep v ugh poke microdosing intelligentsia. Activated charcoal chambray hell of intelligentsia actually. Echo park +1 vice, tattooed photo booth lyft poutine palo santo.

### Forage poke gastropub retro

Cornhole pork belly green juice selfies whatever. Biodiesel aesthetic helvetica adaptogen, flannel drinking vinegar master cleanse artisan fingerstache blog copper mug organic portland raw denim. Photo booth la croix af, butcher keffiyeh mlkshk letterpress locavore. Yr unicorn raw denim skateboard PBR&B air plant jianbing vaporware seitan. Authentic bespoke tilde, trust fund selfies listicle cold-pressed kinfolk ennui normcore before they sold out wayfarers brunch disrupt. Truffaut thundercats church-key, hashtag cronut art party kale chips etsy DIY bicycle rights ramps poutine twee. Activated charcoal tumblr selfies waistcoat. Hella retro hoodie, cray knausgaard lomo semiotics roof party trust fund unicorn man braid. Taiyaki affogato glossier, unicorn green juice put a bird on it trust fund cloud bread. Poutine flexitarian pickled four loko banh mi bushwick taiyaki kitsch cliche cardigan aesthetic lomo affogato offal whatever. Activated charcoal brunch sustainable, adaptogen lumbersexual kombucha gentrify hell of. XOXO lyft edison bulb kickstarter. Iceland vexillologist master cleanse tumblr distillery small batch humblebrag.

Man bun next level messenger bag truffaut 3 wolf moon normcore. Sartorial quinoa synth marfa. Woke tattooed snackwave church-key palo santo +1 XOXO microdosing quinoa kale chips ethical sartorial. IPhone cornhole wayfarers truffaut you probably haven't heard of them. Tofu tattooed humblebrag chillwave. Raclette vegan lumbersexual artisan listicle gentrify narwhal health goth photo booth cred. Vaporware occupy retro, wolf drinking vinegar tumblr craft beer flexitarian freegan thundercats. Normcore asymmetrical try-hard, taxidermy yuccie kickstarter succulents neutra post-ironic cloud bread quinoa. Tumblr man bun microdosing selfies food truck brooklyn. Adaptogen tilde franzen slow-carb disrupt synth fixie coloring book aesthetic pinterest vice waistcoat man bun mustache. Art party af bicycle rights messenger bag, synth seitan cred snackwave hell of keffiyeh semiotics quinoa venmo vinyl knausgaard. Neutra mustache ugh cronut, occupy YOLO pop-up paleo hoodie next level. YOLO poke post-ironic thundercats you probably haven't heard of them DIY poutine echo park tumeric pinterest.

Salvia keffiyeh narwhal lomo. Brunch bitters kickstarter 8-bit hella. Selfies microdosing single-origin coffee cronut shaman 3 wolf moon edison bulb marfa activated charcoal organic asymmetrical mustache jean shorts typewriter. Flexitarian tbh ethical vegan scenester ugh poutine brooklyn cred fanny pack irony wolf. Aesthetic farm-to-table crucifix meditation activated charcoal selvage hoodie sustainable listicle pok pok blue bottle slow-carb etsy. Raclette irony kogi microdosing small batch pop-up. Artisan hell of hammock, bespoke twee af green juice. Crucifix normcore church-key williamsburg quinoa sriracha portland blue bottle iPhone chartreuse tacos. Bicycle rights deep v four loko bespoke small batch stumptown salvia vexillologist next level fingerstache cornhole succulents. Retro 8-bit 90's chillwave.

## Locavore tumblr authentic

Offal portland retro. Pok pok cloud bread literally intelligentsia taiyaki viral vinyl kombucha. Disrupt schlitz lumbersexual ennui chia cronut 90's. Echo park PBR&B migas raw denim. Marfa blue bottle microdosing street art thundercats, glossier sustainable fam coloring book yuccie waistcoat bicycle rights pinterest fanny pack. Fingerstache swag four dollar toast drinking vinegar vexillologist, godard hammock bespoke helvetica food truck ramps. 3 wolf moon marfa narwhal trust fund green juice mumblecore quinoa tilde. Iceland four loko skateboard direct trade kombucha viral lumbersexual pickled meggings fam knausgaard tote bag whatever chia gentrify. Jianbing shabby chic venmo dreamcatcher, 8-bit master cleanse pop-up. Edison bulb thundercats street art distillery blue bottle mixtape tbh you probably haven't heard of them roof party chia tilde mumblecore blog cloud bread mlkshk. Air plant iceland meggings shabby chic lumbersexual leggings. Craft beer lo-fi street art godard seitan poke. Activated charcoal viral twee, pitchfork portland thundercats XOXO fanny pack umami. Migas beard YOLO ugh polaroid umami, lyft hell of heirloom ramps salvia readymade.

### Marfa master cleanse

Seitan, pork belly before they sold out vexillologist etsy vice brunch hot chicken XOXO meggings green juice swag mustache. Twee austin meh quinoa palo santo tousled kombucha taxidermy polaroid chambray pork belly ethical master cleanse kale chips. Activated charcoal readymade glossier tumeric bicycle rights occupy cronut hoodie. Neutra try-hard offal ethical man braid pok pok vice YOLO poutine food truck crucifix. Cronut iPhone pork belly, twee banh mi four dollar toast craft beer chia salvia. Letterpress gastropub selfies cardigan four loko health goth cliche roof party readymade. Offal squid kombucha disrupt PBR&B. Fixie ugh taxidermy aesthetic williamsburg, pork belly tattooed jean shorts lumbersexual small batch. Health goth vexillologist letterpress skateboard kombucha +1 selfies poke beard vape squid tacos neutra etsy. Heirloom snackwave drinking vinegar next level. Chambray selvage viral actually readymade wayfarers jean shorts.

#### Pickled Godard Offal

Plaid banjo listicle selvage iPhone. Affogato selvage tattooed readymade celiac DIY. Stumptown butcher glossier tacos. Deep v tattooed brunch pickled cray crucifix four loko. Succulents freegan pork belly offal tilde, adaptogen cloud bread. Meditation cornhole affogato street art. Af sriracha quinoa brunch drinking vinegar, subway tile vape poutine taiyaki fingerstache raw denim cardigan tbh fixie lomo. Pok pok church-key cronut, photo booth sartorial butcher gastropub hot chicken iceland. Locavore vape pinterest, meggings asymmetrical pok pok letterpress pork belly hella fingerstache. Sustainable literally meditation cold-pressed whatever glossier bushwick quinoa food truck brunch etsy cray. Before they sold out cold-pressed butcher, squid pitchfork biodiesel mumblecore yuccie coloring book semiotics gentrify. Actually cornhole taiyaki keffiyeh artisan try-hard seitan, lo-fi readymade photo booth mustache cronut. Gochujang tumeric biodiesel scenester forage.

#### Taxidermy Bespoke Mlkshk

Disrupt quinoa cliche. *Polaroid* unicorn selfies, bespoke shabby chic jean shorts heirloom yr stumptown fam. Letterpress kinfolk asymmetrical taiyaki health goth 3 wolf moon cred helvetica. Man braid chicharrones venmo, synth kombucha +1 post-ironic squid meggings hell of succulents selfies tumeric sriracha pickled. Unicorn street art kale chips, photo booth etsy hot chicken pour-over twee health goth. Vegan scenester before they sold out, chillwave kogi trust fund lomo freegan sriracha. Quinoa mumblecore crucifix tumblr mlkshk butcher glossier williamsburg post-ironic taiyaki literally hot chicken. Pabst photo booth church-key twee next level tilde vice. Twee butcher cray before they sold out occupy, blue bottle banjo sustainable DIY distillery kogi vape actually. Try-hard pop-up crucifix, thundercats chillwave raclette shaman migas organic. Whatever chillwave fam woke keffiyeh vaporware fashion axe viral shaman. Chartreuse pitchfork kickstarter seitan literally banh mi. Ramps subway tile brunch, intelligentsia scenester offal vexillologist. Church-key YOLO tumeric fashion axe fanny pack.

### Iceland mumblecore normcore

Organic, prism succulents banjo. Knausgaard vexillologist hella, bespoke vice leggings before they sold out man bun roof party tilde chillwave banh mi 8-bit. Photo booth fixie roof party post-ironic taiyaki selvage, bitters fam taxidermy pork belly prism swag. Occupy cloud bread austin hell of selvage iceland la croix slow-carb edison bulb bicycle rights plaid typewriter copper mug normcore. Glossier prism kale chips next level drinking vinegar typewriter bespoke schlitz subway tile man braid organic jianbing kinfolk sriracha. IPhone gentrify yuccie, keytar celiac brunch gochujang venmo. Succulents meggings tbh pug dreamcatcher. Synth humblebrag tattooed tumeric, pitchfork live-edge paleo pickled enamel pin PBR&B cronut venmo gluten-free flexitarian. Aesthetic DIY mixtape brunch. Whatever franzen lomo, pork belly forage chia viral semiotics af cray food truck paleo man braid cardigan post-ironic. Poke craft beer squid kale chips pinterest. Chicharrones hella next level fashion axe, flannel 90's palo santo franzen ennui vexillologist truffaut asymmetrical lo-fi beard. 8-bit schlitz health goth heirloom af art party.

Adaptogen jean shorts franzen locavore 90's blog bitters ennui edison bulb listicle pitchfork viral cornhole keytar. Gastropub intelligentsia fingerstache, four loko post-ironic stumptown cloud bread. Master cleanse craft beer heirloom hot chicken, ugh literally keffiyeh activated charcoal ramps hexagon williamsburg cardigan vinyl kale chips food truck. Green juice bicycle rights health goth vegan pop-up before they sold out. Pabst hashtag viral cred, snackwave microdosing pitchfork raclette glossier man braid keytar celiac readymade. Iceland cardigan seitan, retro ennui cred enamel pin forage vice before they sold out four loko. Fixie crucifix gochujang bespoke yr. IPhone health goth crucifix DIY pug kinfolk. Put a bird on it sustainable snackwave live-edge narwhal fam salvia austin. Waistcoat pickled organic, food truck sriracha you probably haven't heard of them craft beer. Edison bulb selvage jianbing thundercats subway tile etsy. Chicharrones single-origin coffee aesthetic banjo 8-bit.

## Brooklyn Activated Charcoal

Four dollar toast locavore DIY echo park semiotics craft beer hashtag tattooed. Pinterest mlkshk viral helvetica, ugh chillwave cold-pressed mustache leggings fanny pack YOLO vape synth readymade blue bottle. Four loko green juice biodiesel brooklyn pickled viral. Ramps jianbing readymade, salvia af shaman chambray man braid cornhole waistcoat cred. Tattooed semiotics af wayfarers, hammock yr leggings tacos live-edge before they sold out authentic bespoke actually unicorn. Street art master cleanse hell of chartreuse pickled raclette skateboard, cred everyday carry trust fund. Occupy PBR&B twee chia succulents readymade literally neutra raw denim. Church-key knausgaard pinterest jianbing PBR&B listicle sartorial wayfarers blog disrupt poutine aesthetic bitters. Hell of butcher wolf, asymmetrical health goth cloud bread disrupt sartorial. Single-origin coffee pitchfork hammock pickled stumptown flannel, cardigan PBR&B polaroid enamel pin tilde. Yuccie master cleanse helvetica edison bulb disrupt microdosing typewriter selvage, taxidermy echo park synth craft beer 3 wolf moon +1 woke. Swag church-key stumptown, copper mug portland ethical kale chips beard. 8-bit pok pok man bun brooklyn, migas yuccie chillwave trust fund. Dreamcatcher sustainable schlitz direct trade celiac shaman knausgaard bicycle rights fam plaid subway tile man bun. Microdosing aesthetic bespoke whatever hashtag forage, XOXO paleo.

Yuccie retro kickstarter edison bulb tattooed franzen neutra, yr hexagon enamel pin distillery scenester +1 authentic. Lo-fi squid waistcoat vexillologist artisan, plaid poke vice humblebrag kitsch slow-carb iceland. Fanny pack hella mustache aesthetic. Occupy etsy jean shorts thundercats aesthetic air plant chicharrones YOLO fashion axe glossier iceland typewriter pop-up. Neutra unicorn XOXO PBR&B poke stumptown chillwave. Vaporware sartorial bespoke shabby chic seitan tilde. Skateboard pok pok adaptogen squid shoreditch. Drinking vinegar succulents cornhole hexagon iPhone adaptogen fingerstache whatever synth thundercats listicle mixtape heirloom messenger bag blue bottle. Distillery hot chicken kickstarter neutra, pickled disrupt meggings aesthetic craft beer narwhal mustache tilde selfies forage. Jianbing sartorial poutine meditation wolf, gastropub portland humblebrag. YOLO four dollar toast mustache wolf cornhole banh mi marfa sartorial tousled banjo meditation. Cold-pressed bicycle rights jean shorts distillery, pour-over poke yr fixie.

Pinterest thundercats you probably haven't heard of them, drinking vinegar live-edge health goth bitters raclette migas 8-bit craft beer. Ramps taiyaki XOXO art party umami occupy etsy gastropub authentic franzen humblebrag chia quinoa selvage. Street art godard cloud bread, fashion axe kinfolk disrupt edison bulb air plant cliche hell of fam la croix. Quinoa farm-to-table taxidermy gochujang williamsburg activated charcoal narwhal kickstarter shaman vinyl typewriter kitsch. Vexillologist mumblecore raw denim cloud bread tote bag, small batch letterpress irony gentrify YOLO post-ironic umami iceland. Live-edge ramps air plant retro kombucha. Man braid polaroid gochujang, etsy waistcoat subway tile roof party shaman tumeric intelligentsia poutine raclette coloring book pop-up whatever. Freegan gastropub echo park brunch, letterpress roof party synth listicle raclette normcore keytar vaporware neutra pug. Microdosing disrupt retro 90's. Heirloom food truck schlitz snackwave. Af chartreuse offal glossier cronut jianbing thundercats shabby chic bitters man braid freegan before they sold out knausgaard polaroid iceland. Vegan truffaut bitters whatever kogi. Activated charcoal irony brooklyn fashion axe letterpress forage humblebrag YOLO. Hell of tofu direct trade, aesthetic keytar snackwave PBR&B cloud bread asymmetrical yuccie succulents letterpress intelligentsia. Sriracha pitchfork kale chips, gluten-free bitters photo booth seitan lyft readymade salvia cred dreamcatcher wolf bespoke bushwick.

Glossier cloud bread tacos, twee jean shorts vape whatever literally locavore woke dreamcatcher shabby chic narwhal. Meh umami bitters, vice messenger bag single-origin coffee vexillologist polaroid pickled taiyaki. Keffiyeh shoreditch pug, XOXO vexillologist vice typewriter kickstarter gastropub tumblr farm-to-table enamel pin fam put a bird on it leggings. Salvia snackwave skateboard vaporware, fingerstache marfa four loko intelligentsia distillery gentrify vexillologist jean shorts church-key godard tumeric. Wayfarers marfa try-hard, actually hashtag gastropub pork belly butcher deep v poke slow-carb vaporware vegan. Locavore bushwick activated charcoal migas roof party. Four loko austin live-edge jianbing migas squid. Raclette pok pok organic lo-fi glossier, irony ugh kogi ramps yr chia humblebrag hot chicken selfies. +1 single-origin coffee XOXO disrupt coloring book prism asymmetrical roof party organic. Retro glossier scenester selfies deep v cliche venmo DIY hexagon everyday carry brunch la croix helvetica wayfarers. Gastropub banh mi PBR&B hexagon, poke disrupt artisan raclette blog glossier blue bottle paleo cronut. Plaid cronut keytar schlitz letterpress iceland small batch jianbing, glossier XOXO selfies seitan biodiesel flannel health goth. Chicharrones mlkshk small batch, brooklyn neutra man braid flannel. Pour-over blog hexagon, chicharrones neutra woke adaptogen. Chicharrones coloring book man bun gentrify schlitz godard tilde copper mug helvetica.

Taiyaki raclette hexagon, tumblr put a bird on it microdosing deep v 8-bit ethical banjo paleo next level. Brooklyn brunch gochujang, thundercats edison bulb master cleanse twee. Before they sold out meditation stumptown deep v you probably haven't heard of them farm-to-table af hella +1 copper mug bicycle rights taxidermy messenger bag. Cronut echo park quinoa banh mi semiotics keytar. Irony tilde brunch fixie. Knausgaard put a bird on it schlitz, lyft prism disrupt food truck retro freegan subway tile polaroid. Quinoa chillwave disrupt, master cleanse meggings adaptogen kinfolk iceland. Everyday carry chartreuse vape prism lo-fi. Microdosing taxidermy sartorial squid selfies, bitters kinfolk.

Drinking vinegar YOLO swag, pabst cardigan 90's occupy hexagon plaid schlitz poke hot chicken banjo vape. Edison bulb heirloom venmo succulents, tilde subway tile crucifix skateboard. Vape YOLO activated charcoal craft beer ennui seitan distillery. Bespoke copper mug ugh, edison bulb craft beer banh mi hashtag yuccie cardigan tousled plaid kitsch hammock tumeric. Hell of jean shorts marfa, yuccie blue bottle put a bird on it jianbing la croix. Paleo meggings echo park franzen cold-pressed mustache gastropub ethical celiac pop-up prism gochujang. Salvia keffiyeh chillwave taxidermy. Ethical pitchfork tilde cliche polaroid beard. Copper mug neutra lumbersexual biodiesel, echo park fixie blue bottle cardigan irony put a bird on it craft beer artisan hexagon.`,
  },
};
INITIAL_STATE.model.annotations = decorateAnnotations(
  [],
  INITIAL_STATE.ui.user
);

/**
 * Renders Markdown string as HTML table rows. Does not touch the live DOM. 
 * 
 * @param {string} md  - Markdown
 * @returns {DocumentFragment}
 */
function renderMarkdown(md, annotations = [], processors = []) {
  const fragment = document.createDocumentFragment();
  if (!md) return fragment;
  const lines = md.split(/\n/);
  lines.map((line, index) => {
    const row = document.createElement('tr');
    row.classList.add('line');
    row.dataset.line = index + 1;
    row.id = `L${index + 1}`;
    const num = document.createElement('td');
    num.classList.add('line-number');
    num.dataset.line = index + 1;
    row.appendChild(num);
    const content = document.createElement('td');
    content.classList.add('content');

    const listMatcher = /^(\s*)(\*|\-|\d+\.|>) /; // matches list items and quotes
    const matches = line.match(listMatcher);
    if (matches) {
      const indent = matches[1].length + matches[2].length + 1;
      content.style = `padding-left: ${indent}ch; text-indent: -${indent}ch;`;
    }

    const headingMatcher = /^#+ /;
    if (line.match(headingMatcher)) {
      content.classList.add('heading');
    }

    const quoteMatcher = /^>+ /;
    if (line.match(quoteMatcher)) {
      content.classList.add('quote');
    }

    const markup = document.createDocumentFragment();
    markup.appendChild(document.createTextNode('' === line ? '\n' : line));

    content.appendChild(markup);
    row.appendChild(content);
    fragment.appendChild(row);
  });
  return fragment;
}

const CHANGE_SELECTION = 'CHANGE_SELECTION';
const CANCEL_SELECTION = 'CANCEL_SELECTION';
const NEW_ANNOTATION = ' NEW_ANNOTATION';
const CHANGE_COMMENT = 'CHANGE_COMMENT';
const SAVE_ANNOTATION_INTENT = 'SAVE_ANNOTATION_INTENT';
const SAVE_ANNOTATION_RECEIPT = 'SAVE_ANNOTATION_RECEIPT';
const EDIT_ANNOTATION = 'EDIT_ANNOTATION';
const DELETE_ANNOTATION_INTENT = 'DELETE_ANNOTATION_INTENT';
const DELETE_ANNOTATION_RECEIPT = 'DELETE_ANNOTATION_RECEIPT';
const CANCEL_EDIT_ANNOTATION_RECEIPT = 'CANCEL_EDIT_ANNOTATION_RECEIPT';

function decorateAnnotations(annotations = [], user) {
  const array = [...annotations];
  array.mine = function() {
    if (!user) return this;
    return this.filter(a => user === a.user);
  };
  array.findByID = function(id) {
    return this.find(a => id === a.id);
  };
  array.upsert = function(annotation) {
    if (!annotation) throw new ReferenceError(`Missing annotation`);
    if (!annotation.id) throw new ReferenceError(`Missing annotation.id`);

    const arr = [...this];
    const existingIndex = arr.findIndex(a => annotation.id === a.id);
    if (existingIndex > -1) {
      arr.splice(existingIndex, 1);
    }
    arr.push(Object.assign({}, annotation));

    const documentOrder = (a, b) => {
      if (a.range.start.line > b.range.start.line) return true;
      if (a.range.start.line === b.range.start.line) {
        return a.range.start.column > b.range.start.column;
      }
      return false;
    };
    return decorateAnnotations(arr.sort(documentOrder), user);
  };
  array.delete = function(id) {
    const arr = [...this];
    const existingIndex = arr.findIndex(a => id === a.id);
    if (existingIndex > -1) {
      arr.splice(existingIndex, 1);
    }
    return decorateAnnotations(arr, user);
  };
  array.clearUnsaved = function() {
    return decorateAnnotations(array.filter(a => !!a.timestamp));
  };
  array.toJSON = function() {
    return this.filter(a => !a.isDirty);
  };
  return array;
}

/**
 * Redux reducer. Make sure nothing mutates the
 * state in-place.
 * 
 * @param {Object} state - current state
 * @param {Object} action 
 * @returns {Object} - new state
 */
function reducer(state, action) {
  switch (action.type) {
    case CHANGE_SELECTION:
      const tmp0 = Object.assign({}, state);
      tmp0.ui = Object.assign({}, tmp0.ui);
      tmp0.ui.position = action.position;
      tmp0.ui.selection = action.selection;
      return tmp0;
    case CANCEL_SELECTION:
      const tmp7 = Object.assign({}, state);
      tmp7.ui = Object.assign({}, tmp7.ui);
      delete tmp7.ui.selection;
      delete tmp7.ui.position;
      return tmp7;
    case NEW_ANNOTATION:
      const id = uuidv4();
      const tmp = Object.assign({}, state);
      tmp.ui = Object.assign({}, tmp.ui);
      delete tmp.ui.selection;
      delete tmp.ui.position;
      tmp.ui.activeAnnotationID = id;
      tmp.model.annotations = decorateAnnotations(
        state.model.annotations.clearUnsaved(),
        tmp.ui.user
      );
      tmp.model.annotations = tmp.model.annotations.upsert({
        isDirty: true,
        id: id,
        timestamp: null,
        user: state.ui.user,
        comment: '',
        range: {
          start: {
            line: state.ui.selection.start.line,
            column: state.ui.selection.start.column,
          },
          end: {
            line: state.ui.selection.end.line,
            column: state.ui.selection.end.column,
          },
        },
      });
      return tmp;
    case SAVE_ANNOTATION_INTENT:
      const tmp3 = Object.assign({}, state);
      tmp3.model = Object.assign({}, state.model);
      tmp3.model.annotations = state.model.annotations.upsert(
        Object.assign(
          {},
          state.model.annotations.findByID(state.ui.activeAnnotationID),
          {
            timestamp: new Date().toISOString(),
            comment: action.comment,
          }
        )
      );
      return tmp3;
    case SAVE_ANNOTATION_RECEIPT:
      const tmp4 = Object.assign({}, state);
      tmp4.model = Object.assign({}, state.model);
      tmp4.model.annotations = decorateAnnotations(
        state.model.annotations,
        tmp4.ui.user
      ).upsert(
        Object.assign(
          {},
          // FIXME: This should be passed in the action
          state.model.annotations.findByID(state.ui.activeAnnotationID)
        )
      );
      delete tmp4.model.annotations.findByID(state.ui.activeAnnotationID)
        .isDirty;
      tmp4.ui = { isRendering: state.ui.isRendering, user: state.ui.user };
      return tmp4;
    case EDIT_ANNOTATION:
      const tmp5 = Object.assign({}, state);
      tmp5.ui = Object.assign({}, state.ui);
      tmp5.ui.activeAnnotationID = action.id;
      return tmp5;
    // case DELETE_ANNOTATION_INTENT:
    case DELETE_ANNOTATION_RECEIPT:
      const tmp6 = Object.assign({}, state);
      tmp6.model = Object.assign({}, state.model);
      tmp6.model.annotations = state.model.annotations.delete(
        state.ui.activeAnnotationID
      );
      tmp6.ui = Object.assign({}, state.ui);
      delete tmp6.ui.activeAnnotationID;
      return tmp6;
    case CANCEL_EDIT_ANNOTATION_RECEIPT:
      const tmp8 = Object.assign({}, state);
      tmp8.model = Object.assign({}, state.model);
      tmp8.model.annotations = decorateAnnotations(
        state.model.annotations.clearUnsaved(),
        state.ui.user
      );
      tmp8.ui = Object.assign({}, state.ui);
      delete tmp8.ui.activeAnnotationID;
      return tmp8;
    default:
      return INITIAL_STATE;
  }
}
// <https://stackoverflow.com/a/2117523/563324>
function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

const store = createStore(
  reducer,
  applyMiddleware(store => next => action => {
    console.log('Dispatching', action);
    const result = next(action);
    console.log('Next state', store.getState());
    return result;
  })
);

store.subscribe(render, INITIAL_STATE);
store.delayedDispatch = debounce(store.dispatch, 250);

/**
 * Render global state to the live DOM.
 * 
 * @return {undefined}
 */
function render() {
  console.time('render');
  // It’s odd that the state isn’t passed to the subscriber.
  // Need to get the state from the global store itself.
  const state = store.getState();

  state.ui.isRendering = true;

  console.time('renderMarkdown');
  replaceChildren(
    renderMarkdown(state.model.content, state.model.annotations),
    document.querySelector('tbody')
  );
  console.timeEnd('renderMarkdown');
  renderAnnotations(state.model.annotations);

  document.querySelector('#Comment').value = state.ui.activeAnnotationID
    ? state.model.annotations.findByID(state.ui.activeAnnotationID).comment ||
      ''
    : '';

  const selAnn = document.querySelector('#SelectAnnotation');
  if (state.ui.position) {
    selAnn.style.display = 'unset';
    selAnn.style.top = `${state.ui.position.y}px`;
    selAnn.style.left = `${state.ui.position.x}px`;
    selAnn.querySelector('button').focus();
    restoreSelection(state.ui.selection);
  } else {
    selAnn.style.display = 'none';
    selAnn.style.top = `-100px`;
    selAnn.style.left = `-100px`;
  }

  document.querySelector('#Comment').disabled = !state.ui.activeAnnotationID;

  const active = state.model.annotations.findByID(state.ui.activeAnnotationID);
  document.querySelector('#SaveAnnotation').disabled =
    !active || document.querySelector('#Comment').value.length === 0;
  document.querySelector('#DeleteAnnotation').disabled = !active;

  // FIXME: This is ugly and brittle
  if (!active || !active.timestamp) {
    console.log('hide delete');
    document.querySelector('#DeleteAnnotation').style.display = 'none';
  } else {
    document.querySelector('#DeleteAnnotation').style.display = 'unset';
  }
  document.querySelector('#CancelEditAnnotation').disabled = !active;

  const download = document.querySelector('#Download');
  // FIXME: The `toJSON` call is weird.
  // The effect is “those that have been saved". Maybe just a rename
  // of `clearUnsaved` to `onlyPersisted`?
  if (state.model.annotations && state.model.annotations.toJSON().length > 0) {
    download.href = `data:text/markdown;charset=utf-8;base64,${Base64.encode(
      state.model.content +
        '\n\n' +
        serializeAnnotations(state.model.annotations)
    )}`;
    download.download = decodeURIComponent(state.model.href.split('/').pop());
    download.style.display = 'unset';
  } else {
    download.style.display = 'none';
  }

  state.ui.isRendering = false;
  console.timeEnd('render');
}

function serializeAnnotations(annotations) {
  if (!annotations || 0 === annotations.length) {
    return '';
  }
  const NAMESPACE = 'http://marklogic.com/annotations';
  const annotationsJSON = JSON.stringify(annotations, null, 2);
  return `<!--- ${NAMESPACE}\n\n${annotationsJSON}\n\n--->`;
}

function restoreSelection(range) {
  if (!range) return;
  const r = rangeFromOffsets(
    document.querySelector(`#L${range.start.line}>td.content`),
    range.start.column,
    document.querySelector(`#L${range.end.line}>td.content`),
    range.end.column
  );
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(r);
}

/**
 * Assumes the Markdown DOM has been rendered. Works on the live DOM.
 * Probably should make this async for lots of annotations.
 * 
 * @param {Array<Annotation>} annotations 
 * @return undefined
 */
function renderAnnotations(annotations) {
  const state = store.getState();
  // Highlight annotations. Requires that DOM is already committed above
  for (const annotation of annotations) {
    renderAnnotation(
      annotation,
      state.model.annotations.mine().some(a => annotation.id === a.id),
      state.ui.activeAnnotationID === annotation.id
    );
  }
}

function renderAnnotation(annotation, isMine = false, isActive = false) {
  if (!annotation) return;
  const r = rangeFromOffsets(
    document.querySelector(`#L${annotation.range.start.line}>td.content`),
    annotation.range.start.column,
    document.querySelector(`#L${annotation.range.end.line}>td.content`),
    annotation.range.end.column
  );
  highlightRange(r, () => {
    const span = document.createElement('span');
    span.classList.add('annotation');
    span.dataset.annotationId = annotation.id;
    if (isMine) {
      span.classList.add('mine');
    }
    if (isActive) {
      span.classList.add('active');
    }
    span.style.backgroundColor = `rgba(${new ColorHash()
      .rgb(annotation.user)
      .join(', ')}, 0.5)`;
    return span;
  });
}

/**
 * Replaces the entire contents of `oldNode` with `newChild`.
 * It’s generally advisable to use a `DocumentFragment` for the
 * the replacement.
 * 
 * @param {Node|DocumentFragment} newChild 
 * @param {Node} oldNode 
 * @returns {Node}  - The new parent wrapper
 */
function replaceChildren(newChild, oldNode) {
  if (!oldNode) return;
  const tmpParent = document.createElement(oldNode.tagName);
  if (newChild) {
    tmpParent.appendChild(newChild);
  }
  oldNode.parentNode.replaceChild(tmpParent, oldNode);
  return tmpParent;
}

document.addEventListener('DOMContentLoaded', evt => {
  render();
  document.addEventListener('click', evt => {
    console.log('evt.target.classList', evt.target.classList);
    if (evt.target && evt.target.matches('#SaveAnnotation')) {
      store.dispatch({
        type: SAVE_ANNOTATION_INTENT,
        comment: document.querySelector('#Comment').value,
      });
      store.dispatch({
        type: SAVE_ANNOTATION_RECEIPT,
      });
    }
    if (evt.target && evt.target.matches('#DeleteAnnotation')) {
      store.dispatch({
        type: DELETE_ANNOTATION_RECEIPT,
      });
    }
    if (evt.target && evt.target.matches('#CancelEditAnnotation')) {
      store.dispatch({ type: CANCEL_EDIT_ANNOTATION_RECEIPT });
    }
    if (evt.target && evt.target.matches('#SelectAnnotation>button')) {
      store.dispatch({
        type: NEW_ANNOTATION,
      });
      const commentEl = document.querySelector('#Comment');
      commentEl.focus();
      commentEl.setSelectionRange(
        commentEl.value.length,
        commentEl.value.length
      );
    }
    if (evt.target.matches('.annotation.mine')) {
      const annotationEl = evt.target;
      store.dispatch({
        type: EDIT_ANNOTATION,
        id: annotationEl.dataset.annotationId,
      });
      const commentEl = document.querySelector('#Comment');
      commentEl.focus();
      commentEl.setSelectionRange(
        commentEl.value.length,
        commentEl.value.length
      );
    }
  });

  document.addEventListener('input', evt => {
    if (store.getState().ui.isRendering) {
      evt.stopPropagation();
      return;
    }
    const state = store.getState();
    if (evt.target && evt.target.matches('#Comment')) {
      const active = state.model.annotations.findByID(
        state.ui.activeAnnotationID
      );
      document.querySelector('#SaveAnnotation').disabled =
        !active || document.querySelector('#Comment').value.length === 0;
    }
  });

  let isSelecting = false;
  document.addEventListener('selectionchange', evt => {
    isSelecting = !window.getSelection().isCollapsed;
  });
  document.addEventListener('mouseup', evt => {
    if (isSelecting) {
      store.dispatch({
        type: CHANGE_SELECTION,
        selection: getRange(window.getSelection()),
        position: { x: evt.pageX, y: evt.pageY },
      });
      isSelecting = false;
    } else {
      if (store.getState().ui.selection) {
        store.dispatch({ type: CANCEL_SELECTION });
      }
    }
  });
});

/**
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds. If `immediate` is passed, trigger the function on the
 * leading edge, instead of the trailing.
 * 
 * @see https://davidwalsh.name/javascript-debounce-function
 * 
 * @param {function} func 
 * @param {number} [wait=500] 
 * @param {boolean} [immediate=false] 
 * @returns {function}
 */
function debounce(func, wait = 500, immediate = false) {
  var timeout;
  return function() {
    var context = this,
      args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

/**
 * The number of characters from the start of the parent node
 * to the child node, flattening all intervening children, 
 * plus the offset in the child node.
 * 
 * @example <div>ab<a>cd<a>ef</a>f</a>gh</div>
 *          textOffsetFromNode(div, a[1], 1) // 5 = 'ab' + 'cd' + 1
 * 
 * @param {Node} parent 
 * @param {Node} child 
 * @param {number} [childOffset = 0]
 */
function textOffsetFromNode(parent, child, childOffset = 0) {
  if (!parent) return;
  if (!child) return offset;
  // console.log('textOffsetFromNode', parent, child, childOffset);
  const iter = document.createNodeIterator(parent, NodeFilter.SHOW_TEXT);

  let node;
  let offset = 0;
  while (iter.nextNode()) {
    node = iter.referenceNode;
    if (node === child) {
      return offset + childOffset;
    }
    if (Node.TEXT_NODE === node.nodeType) {
      offset += node.textContent.length;
    }
  }
  throw new Error(
    `Couldn’t find ${String(child)} as a child of ${String(parent)}`
  );
}

/**
 * Given a node, find its parent line number, 
 * delegating to `getLine()`.
 * 
 * @param {Node} node 
 * @param {string} [matcher = 'tr.line']
 * @return {number}
 */
function getLineNumber(node, matcher = 'tr.line') {
  return parseInt(getLine(node, matcher).dataset.line, 10);
}

/**
 * Given a node, find its parent line.
 * 
 * @param {Node} node 
 * @param {string} [matcher = 'tr.line']
 */
function getLine(node, matcher = 'tr.line') {
  do {
    if (node.matches && node.matches(matcher)) {
      return node;
    }
  } while ((node = node.parentNode));
  return undefined;
}

/**
 * Given a `Selection`, determine the `Range`, where
 * `start` is always before `end`, regardless 
 * from which direction the selection was made.
 * 
 * @param {Selection} selection 
 * @returns {Object} - `{ start: number, end: number };
 */
function getRange(selection) {
  if (!selection) return;
  if (!(selection instanceof Selection))
    throw new TypeError(String(selection.constructor.name));
  const anchor = {
    line: getLineNumber(selection.anchorNode),
    column: textOffsetFromNode(
      getLine(selection.anchorNode),
      selection.anchorNode,
      selection.anchorOffset
    ),
  };
  const focus = {
    line: getLineNumber(selection.focusNode),
    column: textOffsetFromNode(
      getLine(selection.focusNode),
      selection.focusNode,
      selection.focusOffset
    ),
  };
  // console.log('getRange', anchor, focus);
  if (
    anchor.line < focus.line ||
    (anchor.line === focus.line && anchor.column <= focus.column)
  ) {
    return {
      start: anchor,
      end: focus,
    };
  } else {
    return {
      start: focus,
      end: anchor,
    };
  }
}

/**
 * 
 * @param {Node} parentStart 
 * @param {number} start 
 * @param {Node} parentEnd 
 * @param {number} end 
 * @return {Range} 
 */
function rangeFromOffsets(
  parentStart,
  start = 0,
  parentEnd = parentStart,
  end = 0
) {
  // console.log('rangeFromOffsets', parentStart, start, parentEnd, end);
  const range = document.createRange();
  const s = nodeFromTextOffset(parentStart, start);
  const e = nodeFromTextOffset(parentEnd, end);
  // console.log('rangeFromOffsets#nodeFromTextOffset', s, e);
  range.setStart(childTextNodeOrSelf(s.node), s.offset);
  range.setEnd(childTextNodeOrSelf(e.node), e.offset);

  return range;
}

/**
 * 
 * @param {Node} parent 
 * @param {number} offset 
 * @return {Object} - `{ node: Node, offset: number }`
 */
function nodeFromTextOffset(parent, offset = 0) {
  if (!parent) return;
  // console.log('nodeFromTextOffset', parent, offset);

  const iter = document.createNodeIterator(parent, NodeFilter.SHOW_TEXT);

  let counter = -1;
  let node;
  let last;
  // Find the start node (could we somehow skip this seemingly needless search?)
  while (counter < offset && iter.nextNode()) {
    node = iter.referenceNode;
    if (node.nodeType === Node.TEXT_NODE) {
      last = offset - counter - 1;
      counter += node.textContent.length;
    }
  }
  return { node: node, offset: last };
}

/**
 * Descendent-or-self until you get a `TextNode`
 * 
 * @param {Node} node 
 * @return {TextNode} - Or `undefined` if there are not text 
 *                      children, e.g. `<br/>`
 */
function childTextNodeOrSelf(node) {
  if (!node) return;
  if (!(node instanceof Node)) throw new TypeError(node.constructor.name);

  if (Node.TEXT_NODE === node.nodeType) {
    return node;
  }
  if (node.firstChild) {
    return childTextNodeOrSelf(node.firstChild);
  }
  return undefined;
}
