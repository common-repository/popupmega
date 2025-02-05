<script>
jQuery(function ($) {

	var id = "<?php echo esc_js( $popup_id ) ?>";
	
	var options = <?php $this->echo_popup_options_in_json( $popup_id ) ?>;

	var uniq_id = "<?php echo esc_js( $uniq_id ) ?>";

	var submit_url = "<?php echo wprp_email_manager_store_link() ?>";

	var options = <?php $this->echo_popup_options_in_json( $popup_id ) ?>;

	var rules = options.rules;

	$(".link_<?php echo $this->id . '-' . $popup_id ?>").magnificPopup({
		  type: 'inline',
		  modal: true,
		  closeOnBgClick: false,
		  enableEscapeKey: false,
		  callbacks: {
				open: function() {
				    $('.mfp-bg').css( 'background', options.mask_color );
				    $('.wprp_default_theme').css( 'border-color', options.border_color );
				},
				close: function() {
			      
				    if ( rules.use_cookies )
						wpp_place_popup_close_cookie( id, rules.cookie_expiration_time );
				}
			    
		}
			
	});
	
	

	if ( rules.comment_autofill ) {
		
		wpp_do_comment_autofill( uniq_id, '<?php echo esc_js(COOKIEHASH) ?>' );
	
	}

	$('.' + uniq_id + ' input[type=submit]' ).click(function(e){
		e.preventDefault();

		wprp_handle_form_submit( id, uniq_id, submit_url, rules.cookie_expiration_time );
	});
	
});
</script>

<a class='link_<?php echo $this->id . '-' . $popup_id ?>' href='#<?php echo $this->id . '-' . $popup_id ?>'><?php echo $link_text ?></a>


<div id='<?php echo $this->id . '-' . $popup_id ?>' style='padding:10px; background:#fff;' class="<?php echo $uniq_id ?> wprp_default_theme mfp-hide">
		
		<div class="wprp_popup_default_theme">
			
			<div class="sub_content">
				
				<h3><?php echo $settings['header'] ?></h3>
				
				<ul>
	            	<li><?php echo $settings['list_items'][0] ?></li>
	                <li><?php echo $settings['list_items'][1] ?></li>
	                <li><?php echo $settings['list_items'][2] ?></li>	
				</ul>
				
				<h4><?php echo $settings['sub_header'] ?></h4>
				
				<div class="form_cont">
					
					<form method="POST" action="<?php echo wprp_email_manager_store_link() ?>">
						<p><input type="text" name="name" size="40" placeholder="<?php echo $settings['first_name_text'] ?>" value=""></p>
						
						<p><input type="text"  name="email" size="40" value="" placeholder="<?php echo $settings['enter_email_text'] ?>" required="required"></p>
						
			            <p><input type="submit" class="sbutton sorange" name="submit" value="<?php echo $settings['button_txt'] ?>"></p>

						<input type="hidden" name="wprp_email_manager_nonce" value="<?php echo wprp_email_manager_nonce() ?>" />

					</form>

				</div>

			</div>

		</div>

</div>

<style type="text/css">

.wprp_default_theme {
  position: relative;
  background: #FFF;
  padding: 20px;
  width: auto;
  max-width: 500px;
  margin: 20px auto;
}

.cbox_wprp_default_theme #cboxLoadedContent {
	overflow: hidden !important;
}

.wprp_popup_default_theme .sub_content{
	
	width:370px !important;
	font-family: "Segoe UI", "arial", "verdana", "lucida sans unicode", "tahoma", sans-serif !important;
    line-height: 1.5em;
    margin:5px;
    margin: auto;

}
.wprp_popup_default_theme .sub_content h3{
	text-align:center;
	font-weight:800;
	font-size:18px;
	padding-bottom:5px;
}
.wprp_popup_default_theme .sub_content h4{
	text-align:center;
	font-weight:800;
	margin:5px;
}
.wprp_popup_default_theme .sub_content form{
	text-align:center;
}

.wprp_popup_default_theme .sub_content form input[type="text"] {
	height: 25px;
	margin: 2px;
}
.wprp_popup_default_theme .sub_content ul{
	font-size:13px;
	margin-top:10px;
	margin-bottom:10px;
    margin-left:20px;
    list-style-image: url('<?php echo wprp_image_url( "green-tick.png" ) ?>');
    color: black;
}
.wprp_popup_default_theme .sub_content ul li{
	color: black;
}
.sbutton {
    background: #e05d22;
	background: -webkit-linear-gradient(top, #e05d22 0%, #d94412 100%);
	background: linear-gradient(to bottom, #e05d22 0%, #d94412 100%);
	filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#e05d22', endColorstr='#d94412', GradientType=0);
	display: inline-block;
	padding: 11px 24px 10px;
	color: #fff;
	text-decoration: none;
	border: none;
	border-bottom: 3px solid #b93207;
	border-radius: 2px;
    
    
    display: block;
    margin: auto;
}
.sbutton:hover {
    text-decoration: none;
}
.sbutton:active {
    position: relative;
    top: 1px;
}


<?php if ( defined( 'WPRP_PREMIUM_FUNCTIONALITY' ) ){ include 'theme_style_frontend.php'; } ?>

</style>