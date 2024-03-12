GLOBAL_LIST_EMPTY(job_whitelist) // CHOMPEdit - Managed Globals

/hook/startup/proc/loadJobWhitelist()
	if(config.use_jobwhitelist) // CHOMPedit
		load_jobwhitelist() // CHOMPedit
	return 1

/proc/load_jobwhitelist()
	var/text = file2text("config/jobwhitelist.txt")
	if (!text)
		log_misc("Failed to load config/jobwhitelist.txt")
	else
		GLOB.job_whitelist = splittext(text, "\n") // CHOMPEdit - Managed Globals

/proc/is_job_whitelisted(mob/M, var/rank)
	//TORCHEdit begin
	if(check_rights(R_ADMIN, 0) || check_rights(R_DEBUG, 0) || check_rights(R_EVENT, 0)) // CHOMPedit
		return 1
	var/datum/job/job = job_master.GetJob(rank)
	if(job.admin_only)
		return 0

	if(!config.use_jobwhitelist) // CHOMPedit
		return 1 // CHOMPedit
	//TORCHEdit End
	if(!job.whitelist_only)
		return 1
	if(rank == USELESS_JOB) //VOREStation Edit - Visitor not Assistant
		return 1
<<<<<<< HEAD
	//TORCH Removal. Moved this upwards
	if(!job_whitelist)
=======
	if(check_rights(R_ADMIN, 0) || check_rights(R_DEBUG, 0) || check_rights(R_EVENT, 0)) // CHOMPedit
		return 1
	if(!GLOB.job_whitelist) // CHOMPEdit - Managed Globals
>>>>>>> 24c3099b57 (Properly defines a few global vars (#7938))
		return 0
	if(M && rank)
		for (var/s in GLOB.job_whitelist) // CHOMPEdit - Managed Globals
			if(findtext(s,"[lowertext(M.ckey)] - [lowertext(rank)]"))
				return 1
			if(findtext(s,"[M.ckey] - All"))
				return 1
